import { LikeService, MockLikeService } from '../services/likeService';

export function createLikeService(databaseUrl?: string): LikeService | MockLikeService {
  if (databaseUrl != null && databaseUrl !== '') {
    return new LikeService(databaseUrl);
  }

  return new MockLikeService();
}
