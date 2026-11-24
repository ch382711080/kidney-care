import { describe, expect, it } from 'vitest'
import { createId } from '@/utils/id'

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/

describe('createId', () => {
  it('returns UUID v4 strings', () => {
    expect(createId()).toMatch(UUID_V4)
  })

  it('does not repeat ids', () => {
    const ids = new Set(Array.from({ length: 200 }, () => createId()))
    expect(ids.size).toBe(200)
  })
})
