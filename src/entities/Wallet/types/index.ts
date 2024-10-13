interface ILeaderboard {
    id: number;
    name: string;
    balance: string;
}

interface IUser {
    id: number;
    name: string;
    balance: string;
}

export interface ILeader {
    leaderboard: ILeaderboard[];
    user_rank: number;
    total_user: number;
    current_user: IUser;
}

export interface ITransaction {
    user_id: number;
    amount: number;
    type: string;
    description: string;
}

export interface IWalletHistory {
    total_mined: number;
    transactions: ITransaction[];
}
