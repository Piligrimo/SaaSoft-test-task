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

export const useAppStore = defineStore('app', () => {
  const accounts = ref<Account[]>([])
  const lastId = ref(0)

  const init = () => {
    const savedAccounts = localStorage.getItem('accounts')
    const savedLastId = Number(localStorage.getItem('lastId')) || 0
    try {
      if (savedAccounts) {
        accounts.value = JSON.parse(savedAccounts)
        lastId.value = savedLastId
      }
    } catch {
      console.error('Ошибка! Учетные записи сохраненные локально имеют направильный формат!')
    }
  }

  const saveToLS = () => {
    localStorage.setItem('accounts', JSON.stringify(accounts.value))
    localStorage.setItem('lastId', lastId.value.toString())
  }

  const incrementLastId = () => {
    lastId.value++
  }
  const saveAccount = (data: Account) => {
    const existingAccountIndex = accounts.value.findIndex(account => account.id === data.id)
    if (existingAccountIndex === -1) {
      accounts.value.push({ ...data })
    } else {
      accounts.value[existingAccountIndex] = { ...data }
    }
  }

  const deleteAccount = (id: number) => {
    accounts.value = accounts.value.filter(account => account.id !== id)
  }

  return { init, saveAccount, saveToLS, incrementLastId, deleteAccount, accounts, lastId }
})
