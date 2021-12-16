import { query as q } from "faunadb"

import NextAuth, { Account, Profile, User } from "next-auth"
import GithubProvider from "next-auth/providers/github"

import { fauna } from "../../../services/fauna"

export default NextAuth({
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            authorization: {
                params: {
                    scope: 'read:user',
                },
            },
        }),
    ],
    callbacks: {
        async signIn(user: User, account: Account, profile: Profile & Record<string, unknown>) {

            console.log(user)
            console.log(user.email)
            // await fauna.query(
            //     q.Create(
            //         q.Collection('users'),
            //         { data: { email } }
            //     )
            // )
            return true;
        }
    }
})