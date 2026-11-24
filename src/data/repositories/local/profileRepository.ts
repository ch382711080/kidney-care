import type { Clock } from '@/domain/clock'
import type { Profile } from '@/domain/models'
import type { KidneyCareDB } from '@/data/db'
import type { ProfilePatch, ProfileRepository } from '@/data/repositories/types'
import { requestPersistentStorage } from '@/utils/storage'

export class LocalProfileRepository implements ProfileRepository {
  private readonly db: KidneyCareDB
  private readonly clock: Clock

  constructor(db: KidneyCareDB, clock: Clock) {
    this.db = db
    this.clock = clock
  }

  async get(profileId: string): Promise<Profile | undefined> {
    return this.db.profiles.get(profileId)
  }

  async ensure(profileId: string): Promise<Profile> {
    const existing = await this.db.profiles.get(profileId)
    if (existing) return existing

    const now = this.clock.nowIso()
    const profile: Profile = { id: profileId, createdAt: now, updatedAt: now }

    try {
      await this.db.profiles.add(profile)
      return profile
    } catch {
      // 并发调用时可能已被另一个事务创建，重新读取即可
      const raced = await this.db.profiles.get(profileId)
      if (raced) return raced
      throw new Error('无法创建本地档案')
    }
  }

  async update(profileId: string, patch: ProfilePatch): Promise<Profile> {
    const current = await this.ensure(profileId)
    const updated: Profile = {
      ...current,
      ...patch,
      id: profileId,
      createdAt: current.createdAt,
      updatedAt: this.clock.nowIso(),
    }

    await this.db.profiles.put(updated)
    void requestPersistentStorage()
    return updated
  }
}
