import { RequestMethod } from '@nestjs/common';
import { RouteInfo } from '@nestjs/common/interfaces';

export const userExcludeAuth = [
  {
    path: 'client/auth/login',
    method: RequestMethod.POST,
  },
  {
    path: 'client/auth/google',
    method: RequestMethod.GET,
  },
  {
    path: 'client/auth/google/callback',
    method: RequestMethod.GET,
  },
  {
    path: 'client/auth/register',
    method: RequestMethod.POST,
  },
  {
    path: 'client/auth/forgot-password',
    method: RequestMethod.POST,
  },
] as (string | RouteInfo)[];
