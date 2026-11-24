import { APP_VERSION } from '@/constants/app'
import type { AppSettings } from '@/domain/models'
import type { KidneyCareDB } from '@/data/db'
import type { SettingsPatch, SettingsRepository } from '@/data/repositories/types'
import { requestPersistentStorage } from '@/utils/storage'

export class LocalSettingsRepository implements SettingsRepository {
  private readonly db: KidneyCareDB

  constructor(db: KidneyCareDB) {
    this.db = db
  }

  async get(profileId: string): Promise<AppSettings> {
    const existing = await this.db.settings.get(profileId)
    return existing ?? this.defaults(profileId)
  }

  async ensure(profileId: string): Promise<AppSettings> {
    const existing = await this.db.settings.get(profileId)
    if (existing) return existing

    const settings = this.defaults(profileId)
    try {
      await this.db.settings.add(settings)
      return settings
    } catch {
      const raced = await this.db.settings.get(profileId)
      if (raced) return raced
      throw new Error('无法创建本地设置')
    }
  }

  async update(profileId: string, patch: SettingsPatch): Promise<AppSettings> {
    const current = await this.ensure(profileId)
    const updated: AppSettings = { ...current, ...patch, id: profileId }

    await this.db.settings.put(updated)
    void requestPersistentStorage()
    return updated
  }

  private defaults(profileId: string): AppSettings {
    return {
      id: profileId,
      backupReminderDays: 7,
      activeProfileId: profileId,
      appVersion: APP_VERSION,
    }
  }
}
