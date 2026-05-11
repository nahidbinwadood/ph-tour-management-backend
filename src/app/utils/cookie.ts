import { Response } from 'express';

export const setCookie = (res: Response, cookieName: string, value: string) => {
  res.cookie(cookieName, value, {
    httpOnly: true,
    secure: false,
  });
};

export const setAuthCookie = (
  res: Response,
  tokens: {
    accessToken?: string;
    refreshToken?: string;
  }
) => {
  if (tokens?.accessToken) {
    res.cookie('accessToken', tokens?.accessToken, {
      httpOnly: true,
      secure: false,
    });
  }
  if (tokens?.refreshToken) {
    res.cookie('refreshToken', tokens?.refreshToken, {
      httpOnly: true,
      secure: false,
    });
  }
};

export const removeCookie = (res: Response, cookiesName: string[]) => {
  cookiesName?.forEach((cookie) =>
    res.clearCookie(cookie, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    })
  );
};
