/* eslint-disable @typescript-eslint/no-explicit-any */
import bcryptjs from 'bcryptjs';
import passport from 'passport';
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import { IsActive, Role } from '../modules/users/user.interface';
import { User } from '../modules/users/user.model';
import { envVars } from './env';

// local strategy==>
passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email: string, password: string, done) => {
      try {
        const isUserExist = await User.findOne({ email });

        if (!isUserExist) {
          return done('User not exist');
        }

        const isGoogleAuthenticated = isUserExist?.auths.some(
          (provider) => provider.provider === 'google'
        );

        // throw error if the user is google authenticated==>
        if (isGoogleAuthenticated && !isUserExist.password) {
          return done(null, false, {
            message:
              'You have authenticated through Google. So if you want to login with credentials, then at first login with google and set a password for your Gmail and then you can login with email and password.',
          });
        }

        const isPasswordMatched = await bcryptjs.compare(
          password as string,
          isUserExist.password as string
        );

        // throw error if the password is not matched==>
        if (!isPasswordMatched) {
          return done(null, false, {
            message: 'The email or password is not correct',
          });
        }

        // throw error if the user is not verified==>
        if (!isUserExist.isVerified) {
          return done(null, false, {
            message: 'User is not verified',
          });
        }

        // throw error if the user is inactive or blocked==>
        if (
          isUserExist.isActive === IsActive.BLOCKED ||
          isUserExist.isActive === IsActive.INACTIVE
        ) {
          return done(null, false, {
            message: `User is ${isUserExist.isActive}`,
          });
        }

        // throw error if the user is deleted==>
        if (isUserExist.isDeleted) {
          return done(null, false, {
            message: `User is deleted`,
          });
        }

        return done(null, isUserExist);
      } catch (error) {
        done(error);
      }
    }
  )
);

// google strategy==>
passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile?.emails?.[0]?.value;

        if (!email) {
          return done(null, false, { message: 'Email Not Found' });
        }

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            name: profile?.displayName,
            email,
            picture: profile?.photos?.[0].value,
            role: Role.USER,
            isVerified: true,
            auths: [
              {
                provider: 'google',
                providerId: profile?.id,
              },
            ],
          });
        }

        // throw error if the user is not verified==>
        if (!user.isVerified) {
          return done(null, false, {
            message: 'User is not verified',
          });
        }

        // throw error if the user is inactive or blocked==>
        if (
          user.isActive === IsActive.BLOCKED ||
          user.isActive === IsActive.INACTIVE
        ) {
          return done(null, false, {
            message: `User is ${user.isActive}`,
          });
        }

        // throw error if the user is deleted==>
        if (user.isDeleted) {
          return done(null, false, {
            message: `User is deleted`,
          });
        }
        done(null, user);
      } catch (error) {
        console.log(error);
        done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user?._id);
});

passport.deserializeUser(
  async (
    id: unknown,
    done: (err: any, user?: Express.User | false | null) => void
  ) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      console.log(error);
      done(error);
    }
  }
);
