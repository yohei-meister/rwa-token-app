export enum UserTypes {
  NO_SELECT = "noSelect",
  FUND = "fund",
  USER_A = "userA",
  USER_B = "userB",
  USER_C = "userC",
}

export type UserType =
  | UserTypes.NO_SELECT
  | UserTypes.FUND
  | UserTypes.USER_A
  | UserTypes.USER_B
  | UserTypes.USER_C;

export type User = {
  userType: UserType;
  address: string;
  seed: string;
};

export const users: User[] = [
  {
    userType: UserTypes.FUND,
    address: "rPf8zjAJkCifpErdgPpTDhKvSvXSSVQXPu",
    seed: "sEd7Jgg9yw3iMPTPiYjF7jtkqRX8jG9",
  },
  {
    userType: UserTypes.USER_A,
    address: "rhH2dkq4EYrcjgWzRJUFG1onobuneHhUaJ",
    seed: "sEdSQT4X7CxLVNsvrWnVdnhY5wjBJF1",
  },
  {
    userType: UserTypes.USER_B,
    address: "rhsejn7VqiWP91gtSEEmC7jmB1ZF4wg3an",
    seed: "sEd7pB9GZ3CVcpX5PpKz8Kd5EnFEZqN",
  },
  {
    userType: UserTypes.USER_C,
    address: "rPmgAG8SgemgUmdL7VNeEkunMeHB43x5jR",
    seed: "sEdV5aaNpzqsFLhxEFKxcnfvaxd3bte",
  },
];
