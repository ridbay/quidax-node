import { BaseClient } from '../client';
import { QuidaxResponse, User } from '../types';

export class UsersModule {
  constructor(private client: BaseClient) {}

  /**
   * Creates a new sub-account tethered to the authenticated user.
   * 
   * @param data - The details of the user to create.
   * @param data.email - The email of the sub user (must be unique).
   * @param data.first_name - The first name of the sub user.
   * @param data.last_name - The last name of the sub user.
   * @param data.phone_number - Optional phone number.
   * @returns A promise resolving to the created User object.
   * @throws {QuidaxError} If validation fails or email already exists.
   */
  async create(data: { email: string; first_name: string; last_name: string; phone_number?: string }): Promise<QuidaxResponse<User>> {
    // Note: Quidax v3 docs indicate the endpoint is often /users
    return (this.client as any).post('/users', data);
  }

  /**
   * Fetches the parent (master) account tied to the authenticated secret key.
   * 
   * @returns A promise resolving to the Parent User object.
   */
  async getParentAccount(): Promise<QuidaxResponse<User>> {
    return (this.client as any).get('/users/me');
  }

  /**
   * Edits the details of an existing sub-account.
   * 
   * @param userId - The unique ID or reference of the sub-account.
   * @param data - The data to update.
   * @returns A promise resolving to the updated User object.
   */
  async edit(userId: string, data: { first_name?: string; last_name?: string; phone_number?: string }): Promise<QuidaxResponse<User>> {
    return (this.client as any).put(`/users/${userId}`, data);
  }

  /**
   * Fetches all sub-accounts tied to the authenticated parent account.
   * 
   * @returns A promise resolving to a list of User objects.
   */
  async getAll(): Promise<QuidaxResponse<User[]>> {
    return (this.client as any).get('/users');
  }

  /**
   * Fetches the detailed profile of a specific sub-account.
   * 
   * @param userId - The unique ID or reference of the sub-account.
   * @returns A promise resolving to the User object.
   * @throws {QuidaxError} If the user is not found.
   */
  async getOne(userId: string): Promise<QuidaxResponse<User>> {
    return (this.client as any).get(`/users/${userId}`);
  }
}
