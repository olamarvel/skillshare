// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";

const options = {
  clientId: process.env.TWITTER_CLIENT_ID,
  clientSecret: process.env.TWITTER_CLIENT_SECRET,
};

// console.log(options)

export const authOptions = {
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ token, profile }) {
      // console.log(token,profile,"signing")

      // Verify account age and follower count to filter bots.
      const accountCreationDate = new Date(profile.created_at);
      const now = new Date();
      const accountAgeDays =
        (now - accountCreationDate) / (1000 * 60 * 60 * 24);
      if (accountAgeDays < parseInt(process.env.MIN_ACCOUNT_AGE_DAYS, 10)) {
        console.error("Account too new.");
        return false;
      }
      if (profile.followers_count < parseInt(process.env.MIN_FOLLOWERS, 10)) {
        console.error("Not enough followers.");
        return false;
      }
      return true;
    },
    async jwt({ token, profile }) {
      // On sign in, add Twitter's username (screen_name) to the token.
      // console.log(token,profile)
      if (profile) {
        token.username = profile.screen_name;
        token.twitterId = profile.id; // Twitter’s numeric ID
      }
      return token;
    },
    async session({ session, token }) {
      // console.log(session, token)
      session.user.id = token.sub;
      session.user.username = token.username;
      session.user.twitterId = token.twitterId;
      return session;
    },
  },
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
