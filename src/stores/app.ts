// Utilities
import { defineStore } from 'pinia'

export interface Tag {
  text: string
}
export interface Account {
  id: number
  login: string
  tags: Tag[]
  type: 'local' | 'ldap'
  password: string
}

export const useAppStore = defineStore('app', {
  state: () => ({
    accounts: [] as Account[],
    lastId: 0,
  }),
  actions: {
    init () {
      const savesAccounts = localStorage.getItem('accounts')
      const lastId = Number(localStorage.getItem('lastId')) || 0
      try {
        if (savesAccounts) {
          this.accounts = JSON.parse(savesAccounts)
          this.lastId = lastId
        }
      } catch {
        console.error('Ошибка! Учетные записи сохраненные локально имеют направильный формат!')
      }
    },
    saveToLS () {
      localStorage.setItem('accounts', JSON.stringify(this.accounts))
      localStorage.setItem('lastId', this.lastId.toString())
    },
    addAccount () {
      this.accounts.push({
        id: this.lastId,
        login: '',
        tags: [],
        type: 'local',
        password: '',
      })
      this.lastId++
    },
    deleteAccount (id: number) {
      this.accounts = this.accounts.filter(account => account.id !== id)
    },
    setField<K extends keyof Account> (id: number, field: K, value: Account[K]) {
      const account = this.getById(id)
      if (!account) {
        return
      }
      account[field] = value
    },
    setTagsField (id: number, value: string) {
      const tags: Tag[] = value.split(';').map(text => ({ text }))
      this.setField(id, 'tags', tags)
    },
  },
  getters: {
    getById (state) {
      return (id: number) => state.accounts.find(account => account.id === id)
    },
    getTagsAsString () {
      return (id: number) => this.getById(id)?.tags.map(({ text }) => text).join(';')
    },
  },
})
