import { APIRequestContext, request } from '@playwright/test';

export class ApiClient {
  private request: APIRequestContext;

  constructor() {
    this.request = request.newContext();
  }

  async get(endpoint: string) {
    return this.request.get(endpoint);
  }

  async post(endpoint: string, data: object) {
    return this.request.post(endpoint, {
      data
    });
  }
}