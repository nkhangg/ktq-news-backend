import { RequestMethod } from '@nestjs/common';
import { RouteInfo } from '@nestjs/common/interfaces';

export const excludeAuth = [
  {
    path: 'admin/auth/login',
    method: RequestMethod.POST,
  },
  {
    path: 'admin/auth/forgot-password',
    method: RequestMethod.POST,
  },
] as (string | RouteInfo)[];

export const excludeAuthor = [
  ...excludeAuth,
  {
    path: 'admin/auth/change-password',
    method: RequestMethod.POST,
  },
  {
    path: 'admin/auth/logout',
    method: RequestMethod.POST,
  },
  {
    path: 'admin/auth/me',
    method: RequestMethod.GET,
  },
] as (string | RouteInfo)[];
