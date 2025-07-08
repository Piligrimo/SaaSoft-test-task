<template>
  <div>
    <v-container class="container fill-height" max-width="900">
      <h1 class="text-h4 font-weight-bold my-4">
        <span class="mr-4">Учетные записи</span>
        <v-btn icon="mdi-plus" rounded="lg" variant="outlined" @click="store.addAccount" />
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
          <v-col cols="3">
            <v-text-field
              density="compact"
              label="Метки"
              :model-value="store.getTagsAsString(account.id)"
              :rules="[rules.max50]"
              validate-on="blur"
              @update:model-value="store.setTagsField(account.id, $event)"
            />
          </v-col>
          <v-col cols="2">
            <v-select
              density="compact"
              :items="types"
              label="Тип записи"
              :model-value="account.type"
              @update:model-value="store.setField(account.id, 'type', $event)"
            />
          </v-col>
          <v-col :cols="account.type === 'local' ? 3 : 6">
            <v-text-field
              density="compact"
              label="Логин"
              :model-value="account.login"
              :rules="[rules.required, rules.max100]"
              validate-on="blur"
              @update:model-value="store.setField(account.id, 'login', $event)"
            />
          </v-col>
          <v-col v-if="account.type === 'local'" cols="3">
            <v-text-field
              density="compact"
              label="Пароль"
              :model-value="account.password"
              :rules="[rules.required, rules.max100]"
              type="password"
              validate-on="blur"
              @update:model-value="store.setField(account.id, 'password', $event)"
            />
          </v-col>
          <v-col cols="1">
            <v-btn icon="mdi-trash-can" rounded="lg" variant="plain" @click="store.deleteAccount(account.id)" />
          </v-col>
        </v-row>
      </template>
    </v-container>
  </div>
</template>

<script setup lang="ts">
  import { useAppStore } from '@/stores/app'

  const store = useAppStore()

  const createMaxRule = (max: number) => {
    return (val: string) => val.length <= max || `Введите ${max} или меньше символов`
  }

  const rules = {
    required: (val: string) => !!val || 'Обязательное поле',
    max100: createMaxRule(100),
    max50: createMaxRule(50),
  }

  store.init()

  addEventListener('unload', () => {
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

  const accounts = computed(() => store.accounts)
</script>

<style scoped>
  .container {
    display: block !important;
  }
</style>
