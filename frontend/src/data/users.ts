export enum UserTypes {
  NO_SELECT = "noSelect",
  FUND = "fund",
  USER_A = "userA High",
  USER_B = "userB Low",
  USER_C = "userC NG",
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
    address: "rUWhzgtWjpQ1yCJJj1tx6STyppYsidDfu6",
    seed: "sEdSvhPaoaDJ1KRKhXWJVTwY4JNoGz3",
  },
  {
    userType: UserTypes.USER_A,
    address: "rhCES3VAFoRy7Cncjb3ozYW9RgMMYJLah2",
    seed: "sEdVrsBxtS5CdeZ1YiE2SfwLVeuSWZ2",
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
