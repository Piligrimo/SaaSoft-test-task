<template>
  <div>
    <v-container class="fill-height container" max-width="900">
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
        <v-row v-for="(account, i) in accounts" :key="i">
          <v-col cols="3">
            <v-text-field v-model="account.tags" label="Метки" />
          </v-col>
          <v-col cols="2">
            <v-select v-model="account.type" :items="types" label="Тип записи" />
          </v-col>
          <v-col :cols="account.type === 'local' ? 3 : 6">
            <v-text-field v-model="account.login" label="Логин" />
          </v-col>
          <v-col v-if="account.type === 'local'" cols="3">
            <v-text-field v-model="account.password" label="Пароль" />
          </v-col>
          <v-col cols="1">
            <v-btn icon="mdi-trash-can" rounded="lg" variant="plain" @click="addAccount" />
          </v-col>
        </v-row>
      </template>
    </v-container>
  </div>
</template>

<script setup lang="ts">
  interface Account {
    login: string
    tags: string
    type: 'local' | 'ldap'
    password: string
  }

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

  const accounts = ref<Account[]>([])

  const addAccount = () => {
    accounts.value.push({
      login: '',
      tags: '',
      type: 'local',
      password: '',
    })
  }
</script>

<style scoped>
  .container {
    display: block;
  }
</style>
