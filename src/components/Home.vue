<template>
  <div>
    <v-container class="container fill-height" max-width="900">
      <h1 class="text-h4 font-weight-bold my-4">
        <span class="mr-4">Учетные записи</span>
        <v-btn icon="mdi-plus" rounded="lg" variant="outlined" @click="addAccount" />
      </h1>

      <v-row>
        <v-col cols="12">
          <v-banner
            color="info"
            icon="mdi-help"
            rounded="lg"
          >
            <template #text>
              Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;
            </template>
          </v-banner>
        </v-col>
      </v-row>
      <v-row v-if="accounts.length === 0">
        <v-col cols="12">
          <v-card>
            <template #text>Пока не создано ни одной учетной записи. Для создания нажмите кноку "+" в заголовке страницы</template>
          </v-card>
        </v-col>
      </v-row>
      <template v-else>
        <v-row v-for="account in accounts" :key="account.id">
          <v-form
            :ref="(el) => formRefs[account.id] = el"
            class="form"
          >
            <v-col cols="3">
              <v-text-field
                density="compact"
                label="Метки"
                :model-value="getTagsAsString(account.tags)"
                :rules="[rules.max50]"
                validate-on="blur"
                @blur="saveIfValid(account)"
                @update:model-value="setTagsField(account, $event)"
              />
            </v-col>
            <v-col cols="2">
              <v-select
                v-model="account.type"
                density="compact"
                :items="types"
                label="Тип записи"
                validate-on="input"
                @update:model-value="saveIfValid(account)"
              />
            </v-col>
            <v-col :cols="account.type === 'local' ? 3 : 6">
              <v-text-field
                v-model="account.login"
                density="compact"
                label="Логин"
                :rules="[rules.required, rules.max100]"
                validate-on="blur"
                @blur="saveIfValid(account)"
              />
            </v-col>
            <v-col v-if="account.type === 'local'" cols="3">
              <v-text-field
                v-model="account.password"
                density="compact"
                label="Пароль"
                :rules="[rules.required, rules.max100]"
                type="password"
                validate-on="blur"
                @blur="saveIfValid(account)"
              />
            </v-col>
            <v-col cols="1">
              <v-btn icon="mdi-trash-can" rounded="lg" variant="plain" @click="deleteAccount(account.id)" />
            </v-col>
          </v-form>
        </v-row>
      </template>
    </v-container>
  </div>
</template>

<script setup lang="ts">
  import { type Account, type Tag, useAppStore } from '@/stores/app'

  const store = useAppStore()

  store.init()

  const accounts = ref<Account[]>(structuredClone(toRaw(store.accounts)))

  const formRefs = ref<Record<number, any>>({})

  const addAccount = () => {
    accounts.value.push({
      id: store.lastId,
      login: '',
      tags: [],
      type: 'local',
      password: '',
    })
    store.incrementLastId()
  }

  const createMaxRule = (max: number) => {
    return (val: string) => val.length <= max || `Введите ${max} или меньше символов`
  }

  const rules = {
    required: (val: string) => !!val || 'Обязательное поле',
    max100: createMaxRule(100),
    max50: createMaxRule(50),
  }

  addEventListener('beforeunload', async event => {
    if (accounts.value.length > store.accounts.length && !confirm()) {
      event.preventDefault()
    }
    store.saveToLS()
  })

  const types = [
    {
      title: 'Локальная',
      value: 'local',
    },
    {
      title: 'LDAP',
      value: 'ldap',
    },
  ]

  const getTagsAsString = (tags: Tag[]) =>
    tags.map(({ text }) => text).join(';')

  const setTagsField = (account: Account, value: string) => {
    const tags: Tag[] = value.split(';').map(text => ({ text }))
    account.tags = tags
  }

  const saveIfValid = async (account: Account) => {
    setTimeout(() => {
      const isValid = formRefs.value[account.id].isValid

      if (isValid) {
        store.saveAccount(account)
      }
    })
  }

  const deleteAccount = (id: number) => {
    accounts.value = accounts.value.filter(account => account.id !== id)
    store.deleteAccount(id)
  }
</script>

<style scoped>
  .container {
    display: block !important;
  }
  .form {
    display: flex;
    width: 100%;
  }
</style>
