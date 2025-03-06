import { Player } from "../types";
import { StorageService } from "./storageService";
import { v4 as uuid } from "uuid";

/**
 * Manages game/player related operations
 */
export class GameService {
  private storageService: StorageService;

  public constructor() {
    this.storageService = StorageService.getInstance();
  }

  public async createGameRoom(hostId: string): Promise<string> {
    const host: Player = {
      id: hostId,
      name: `Player_${hostId.substring(0, 5)}`,
    };

    const newGameId = uuid();

    const gameText = "";

    await this.storageService.addGame(newGameId, gameText, host);

    return newGameId;
  }

  public async checkGameId(gameId: string): Promise<boolean> {
    return await this.storageService.checkGameId(gameId);
  }

  public async joinGameRoom(gameId: string, userId: string): Promise<Player[]> {
    const player: Player = {
      id: userId,
      name: `Player_${userId.substring(0, 5)}`,
    };

    return await this.storageService.joinGame(gameId, player);
  }
}
