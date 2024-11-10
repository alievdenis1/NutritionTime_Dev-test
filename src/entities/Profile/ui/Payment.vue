<template>
	<div
		class="min-h-screen pt-5 bg-gradient-to-br from-green-800 to-green-900
	flex flex-col relative overflow-hidden"
	>
		<div class="absolute inset-0 cannabis-pattern opacity-20" />
		<div class="absolute top-0 left-0 right-0 h-32 gradient-overlay" />
		<div class="absolute inset-0 bg-gradient-radial from-transparent to-green-900 opacity-40" />
		<div class="flex-grow flex flex-col p-4 relative z-10">
			<h2 class="text-4xl font-bold text-yellow-400 text-center mb-6 animate-float">
				<span class="drop-shadow-glow text-stroke">Payment</span>
			</h2>

			<!-- Order Information Card -->
			<div
				v-if="order"
				class="bg-gray-800 bg-opacity-80 backdrop-filter backdrop-blur-xl rounded-2xl
				overflow-hidden shadow-2xl p-8 animate-fade-in transform hover:scale-[1.02]
				transition-all duration-300"
			>
				<!-- Order Details -->
				<div class="space-y-2">
					<p class="text-yellow-400 font-bold">
						Order ID: <span class="text-gray-300">{{ order.id }}</span>
					</p>
					<p class="text-yellow-400 font-bold">
						Status: <span class="text-gray-300">{{ orderStatus }}</span>
					</p>
					<p class="text-yellow-400 font-bold">
						Total Amount (USD): <span class="text-green-400">${{ order.total_amount }}</span>
					</p>
					<p
						v-if="cryptoAmount"
						class="text-yellow-400 font-bold"
					>
						Amount in TON: <span class="text-green-400">{{ cryptoAmount }} TON</span>
					</p>
				</div>

				<!-- Wallet Connection -->
				<div class="w-full flex justify-center my-6">
					<TonConnectButton />
				</div>

				<!-- Connected Wallet Info -->
				<div
					v-if="walletInfo"
					class="space-y-4 animate-fade-in"
				>
					<PaymentMethodSelector
						v-model="selectedPaymentMethod"
					/>
					<p class="text-yellow-400 font-bold">
						Selected payment method:
						<span class="text-gray-300">{{ selectedPaymentMethod.displayName }}</span>
					</p>
					<p
						v-if="cryptoAmount"
						class="text-yellow-400 font-bold"
					>
						Amount in {{ selectedPaymentMethod.symbol }}:
						<span class="text-green-400">{{ cryptoAmount }} {{ selectedPaymentMethod.symbol }}</span>
					</p>

					<p class="text-yellow-400 font-bold">
						Wallet connected: <span class="text-gray-300">{{ walletInfo.device.appName }}</span>
					</p>
					<p class="text-yellow-400 font-bold">
						Address: <span class="text-gray-300 break-all">{{ address }}</span>
					</p>

					<!-- Payment Button -->
					<button
						v-if="showPayButton"
						:disabled="isPayButtonDisabled"
						class="checkout-btn w-full mt-4"
						@click="payWithTon"
					>
						<span class="relative z-10">{{ buttonText }}</span>
					</button>
				</div>
				<div
					v-else
					class="text-yellow-400 text-center animate-pulse mt-4"
				>
					Please connect your wallet to proceed with payment
				</div>

				<!-- Payment Status -->
				<div
					v-if="paymentStatus === 'checking'"
					class="mt-4 text-center"
				>
					<p class="text-yellow-400">
						Checking payment status...
					</p>
					<p class="text-gray-300">
						Please confirm the transaction in your wallet.
					</p>
					<button
						class="checkout-btn w-full mt-4"
						@click="cancelPaymentProcess"
					>
						Cancel Payment
					</button>
				</div>

				<!-- Error Display -->
				<div
					v-if="paymentStatus === 'failed'"
					class="mt-4 text-center"
				>
					<p class="text-red-500">
						{{ error }}
					</p>
				</div>
			</div>

			<!-- Loading State -->
			<div
				v-else-if="loading"
				class="bg-gray-800 bg-opacity-80 backdrop-filter backdrop-blur-xl rounded-2xl
				overflow-hidden shadow-2xl p-8 animate-pulse"
			>
				<p class="text-yellow-400 text-xl text-center">
					<i class="fas fa-spinner fa-spin mr-2" />Loading order information...
				</p>
			</div>

			<!-- Error State -->
			<div
				v-else
				class="bg-gray-800 bg-opacity-80 backdrop-filter backdrop-blur-xl rounded-2xl
				overflow-hidden shadow-2xl p-8 animate-shake"
			>
				<p class="text-red-500 text-xl text-center">
					<i class="fas fa-exclamation-triangle mr-2" />
					{{ error || 'Failed to load order information. Please try again later.' }}
				</p>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
 import { defineComponent, ref, onMounted, computed, watch } from 'vue'
 import { useRoute, useRouter } from 'vue-router'
 import { PaymentMethodSelector } from './index'
 import { getOrder, updateOrder, cancelPayment, preparePayment, checkPaymentStatus }
  from '../api/order'
 import { type Order, type OrderStatus, type PreparedPayment, type PaymentMethod,
  AVAILABLE_PAYMENT_METHODS } from '../model/order'

 import { TonConnectButton, useTonAddress, useTonWallet, useTonConnectUI }
  from '@townsquarelabs/ui-vue'
 import type { SendTransactionResponse } from '@tonconnect/sdk'
 import { Address, beginCell, toNano } from '@ton/core'

 export default defineComponent({
  name: 'CryptoPayment',
  components: { TonConnectButton, PaymentMethodSelector },

  setup() {
   // Route and Router
   const route = useRoute()
   const router = useRouter()

   // State Management
   const order = ref<Order | null>(null)
   const loading = ref(true)
   const error = ref<string | null>(null)
   const cryptoAmount = ref<number | null>(null)
   const paymentAddress = ref<string | null>(null)
   const paymentId = ref<number | null>(null)
   const paymentStatus = ref<'idle' | 'preparing' | 'checking' | 'completed' | 'failed'>('idle')
   const orderStatus = ref<OrderStatus | null>(null)
   const transactionResult = ref<SendTransactionResponse | null>(null)
   const monitoringActive = ref(false)

   // TON Connect Integration
   const address = useTonAddress()
   const wallet = useTonWallet()
   const [tonConnectUI] = useTonConnectUI()

   // Computed Properties
   const walletInfo = computed(() => wallet.value)

   const buttonText = computed(() => {
    switch (paymentStatus.value) {
     case 'idle': return 'Pay with TON'
     case 'failed': return 'Retry Payment'
     case 'preparing': return 'Preparing Payment...'
     case 'checking': return 'Processing...'
     case 'completed': return 'Payment Completed!'
     default: return 'Pay'
    }
   })

   const showPayButton = computed(() => {
    return paymentStatus.value === 'idle' || paymentStatus.value === 'failed'
   })

   const isPayButtonDisabled = computed(() => {
    return loading.value ||
     !cryptoAmount.value ||
     orderStatus.value !== 'created' ||
     (paymentStatus.value !== 'idle' && paymentStatus.value !== 'failed')
   })

   // Payment Transaction Creation
   const createCommentPayload = (orderId: number): string => {
    const comment = `ORDER:${orderId}`
    const textEncoder = new TextEncoder()
    const commentBytes = textEncoder.encode(comment)

    const prefix = new Uint8Array(4)
    const fullMessage = new Uint8Array(prefix.length + commentBytes.length)
    fullMessage.set(prefix)
    fullMessage.set(commentBytes, prefix.length)

    return Buffer.from(fullMessage).toString('base64')
   }

   // API Integration Methods
   const fetchOrderDetails = async () => {
    const orderId = parseInt(route.params.orderId as string)
    if (isNaN(orderId)) {
     error.value = 'Invalid order ID'
     loading.value = false
     return
    }

    const { data, error: apiError, execute } = getOrder(orderId)
    await execute()

    if (apiError.value) {
     error.value = apiError.value
    } else if (data.value) {
     order.value = data.value
     orderStatus.value = data.value.status as OrderStatus
     await initializePaymentForOrder(orderId)

     if (orderStatus.value === 'pending') {
      monitorPaymentStatus(orderId)
     } else if (orderStatus.value === 'accepted') {
      router.push({ name: 'orderConfirmation', params: { orderId: orderId.toString() } })
     }
    }
    loading.value = false
   }

   const initializePaymentForOrder = async (orderId: number) => {
    const { data, error: initError, execute } = preparePayment(orderId)
    await execute()

    if (initError.value) {
     error.value = initError.value
    } else if (data.value) {
     cryptoAmount.value = data.value.crypto_amount
     paymentAddress.value = data.value.payment_address
     paymentId.value = data.value.payment_id
    }
   }

   // Payment Processing
   const validateAddress = (addressStr: string): boolean => {
    try {
     Address.parse(addressStr)
     return true
    } catch {
     return false
    }
   }

   const payWithTon = async () => {
    if (!order.value || !walletInfo.value || !address.value) {
     error.value = 'Please connect your wallet and ensure order information is loaded.'
     return
    }

    // Добавляем проверку адресов
    if (selectedPaymentMethod.value.type === 'jetton' &&
     (!validateAddress(selectedPaymentMethod.value.address!) ||
      !validateAddress(address.value))) {
     error.value = 'Invalid address format'
     return
    }

    paymentStatus.value = 'preparing'
    error.value = null

    try {
     const { data: paymentInfo, error: paymentError, execute: executePrepare } =
      preparePayment(order.value.id)
     await executePrepare()

     if (paymentError.value) throw new Error(paymentError.value)
     if (!paymentInfo.value) throw new Error('Failed to prepare payment')

     const { order_id, payment_address, payment_id } = paymentInfo.value
     paymentId.value = payment_id
     cryptoAmount.value = paymentInfo.value.crypto_amount
     paymentAddress.value = payment_address

     await updateOrderStatus('pending')
     orderStatus.value = 'pending'
     monitorPaymentStatus(order_id)

     const transaction = createPaymentTransaction(paymentInfo.value)

     tonConnectUI.sendTransaction(transaction)
      .then((result: SendTransactionResponse) => {
       transactionResult.value = result
       console.log('Transaction sent:', result)
      })
      .catch(async (e) => {
       handleTransactionError(e)
      })

    } catch (e) {
     handlePaymentError(e)
    } finally {
     loading.value = false
    }
   }

   // Error Handling
   const handleTransactionError = async (e: unknown) => {
    console.error('Payment error:', e)
    if (e instanceof Error) {
     if (e.message.includes('Wallet declined the request')) {
      error.value = 'Payment failed: You declined the transaction in your wallet.'
      paymentStatus.value = 'failed'
      await resetOrderStatus()
      stopPaymentMonitoring()
     } else if (e.message.includes('Transaction was not sent')) {
      console.log('Transaction was not sent. Continuing to monitor payment status.')
     } else {
      error.value = e.message
      paymentStatus.value = 'failed'
      await resetOrderStatus()
      stopPaymentMonitoring()
     }
    } else {
     error.value = 'Payment failed'
     paymentStatus.value = 'failed'
     await resetOrderStatus()
     stopPaymentMonitoring()
    }
   }

   const handlePaymentError = async (e: unknown) => {
    console.error('Payment failed:', e)
    error.value = e instanceof Error ? e.message : 'Payment failed'
    paymentStatus.value = 'failed'
    await resetOrderStatus()
    stopPaymentMonitoring()
   }

   // Payment Status Monitoring
   const monitorPaymentStatus = (orderId: number) => {
    if (monitoringActive.value) return

    paymentStatus.value = 'checking'
    monitoringActive.value = true
    let attempts = 0
    const maxAttempts = 60
    const delay = 5000

    const checkStatus = async () => {
     if (!monitoringActive.value) return

     if (attempts >= maxAttempts) {
      console.error('Payment verification timeout.')
      error.value = 'Payment verification timeout. Please check your wallet for the transaction status.'
      paymentStatus.value = 'failed'
      await resetOrderStatus()
      stopPaymentMonitoring()
      return
     }

     const { data: statusData, error: statusError, execute: executeStatus } =
      checkPaymentStatus(orderId)
     await executeStatus()

     if (statusError.value) {
      console.error('Error checking payment status:', statusError.value)
     } else if (statusData.value?.status) {
      switch (statusData.value.status) {
       case 'completed':
        paymentStatus.value = 'completed'
        orderStatus.value = 'accepted'
        stopPaymentMonitoring()
        await updateOrderStatus('accepted')
        router.push({ name: 'orderConfirmation', params: { orderId: orderId.toString() } })
        return
       case 'pending':
        console.log('Payment still pending')
        break
       case 'canceled':
        error.value = 'Payment was canceled'
        paymentStatus.value = 'failed'
        await resetOrderStatus()
        stopPaymentMonitoring()
        return
       default:
        console.warn('Unknown payment status:', statusData.value.status)
      }
     }

     attempts++
     setTimeout(checkStatus, delay)
    }

    checkStatus()
   }

   const stopPaymentMonitoring = () => {
    monitoringActive.value = false
   }

   // Order Status Management
   const resetOrderStatus = async () => {
    await updateOrderStatus('created')
    orderStatus.value = 'created'
   }

   const updateOrderStatus = async (status: OrderStatus) => {
    const { error: updateError, execute: executeUpdate } =
     updateOrder(order.value!.id, { status })
    await executeUpdate()

    if (updateError.value) {
     console.error('Error updating order status:', updateError.value)
    } else {
     orderStatus.value = status
    }
   }

   const cancelPaymentProcess = async () => {
    if (paymentId.value) {
     const { error: cancelError, execute: executeCancel } =
      cancelPayment(paymentId.value)
     await executeCancel()
     if (cancelError.value) {
      console.error('Error cancelling payment:', cancelError.value)
     }
    }
    paymentStatus.value = 'idle'
    await resetOrderStatus()
    stopPaymentMonitoring()
   }

   // Lifecycle Hooks and Watchers
   onMounted(() => {
    fetchOrderDetails()
   })

   const selectedPaymentMethod = ref<PaymentMethod>(AVAILABLE_PAYMENT_METHODS[0])

   // функция создания транзакции
   const createPaymentTransaction = (paymentInfo: PreparedPayment) => {
    const method = selectedPaymentMethod.value

    if (method.type === 'ton') {
     return {
      validUntil: Math.floor(Date.now() / 1000) + 600,
      messages: [
       {
        address: paymentInfo.payment_address,
        amount: toNano(paymentInfo.crypto_amount).toString(),
        payload: createCommentPayload(paymentInfo.order_id)
       }
      ]
     }
    }

    if (method.type === 'jetton') {
     const jettonWalletAddress = Address.parse(method.address!)
     const destinationAddress = Address.parse(paymentInfo.payment_address)
     const userAddress = Address.parse(address.value!)

     return {
      validUntil: Math.floor(Date.now() / 1000) + 600,
      messages: [
       {
        address: jettonWalletAddress.toString(),
        amount: toNano('0.05').toString(),
        stateInit: undefined,
        payload: createJettonTransferPayload({
         jettonAmount: paymentInfo.crypto_amount,
         toAddress: destinationAddress.toString(),
         responseAddress: userAddress.toString(),
         forwardAmount: toNano('0.000000001').toString(),
         forwardPayload: createCommentPayload(paymentInfo.order_id)
        })
       }
      ]
     }
    }

    throw new Error('Unsupported payment method')
   }

   // Добавим функцию создания payload для перевода жетонов
   const createJettonTransferPayload = (
    { jettonAmount,
     toAddress,
     responseAddress,
     forwardAmount,
     forwardPayload
    }: {
    jettonAmount: number,
    toAddress: string,
    responseAddress: string,
    forwardAmount: string,
    forwardPayload: string
   }) => {
    return beginCell()
     .storeUint(0xf8a7ea5, 32) // transfer op code
     .storeUint(0, 64) // query id
     .storeCoins(toNano(jettonAmount)) // amount
     .storeAddress(Address.parse(toAddress)) // destination
     .storeAddress(Address.parse(responseAddress)) // response destination
     .storeBit(false) // custom payload
     .storeCoins(BigInt(forwardAmount)) // forward amount
     .storeBit(true) // forward payload
     .storeRef(
      beginCell()
       .storeBuffer(Buffer.from(forwardPayload, 'base64'))
       .endCell()
     )
     .endCell()
     .toBoc()
     .toString('base64')
   }

   watch(selectedPaymentMethod, async (newMethod) => {
    if (order.value) {
     // Пересчитываем сумму при смене метода оплаты
     const { data, error: initError, execute } = preparePayment(order.value.id, newMethod.symbol)
     await execute()

     if (initError.value) {
      error.value = initError.value
     } else if (data.value) {
      cryptoAmount.value = data.value.crypto_amount
      paymentAddress.value = data.value.payment_address
      paymentId.value = data.value.payment_id
     }
    }
   })

   watch(() => route.params.orderId, () => {
    fetchOrderDetails()
   })

   watch(orderStatus, (newStatus) => {
    if (newStatus === 'accepted' || newStatus === 'delivery' || newStatus === 'delivered') {
     router.push({
      name: 'orderConfirmation',
      params: { orderId: order.value!.id.toString() }
     })
    } else if (newStatus === 'pending' && !monitoringActive.value) {
     monitorPaymentStatus(order.value!.id)
    }
   })

   return {
    // State
    order,
    loading,
    error,
    address,
    walletInfo,
    paymentStatus,
    cryptoAmount,
    orderStatus,

    // Computed
    buttonText,
    showPayButton,
    isPayButtonDisabled,

    // Methods
    payWithTon,
    cancelPaymentProcess,
    selectedPaymentMethod // Добавляем в return
   }
  }
 })
</script>
