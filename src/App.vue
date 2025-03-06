<template>
  <ion-app>
    <HomePage />
  </ion-app>
</template>

<script lang="ts">
import { IonApp } from '@ionic/vue';
import { defineComponent } from 'vue';
import HomePage from './views/HomePage.vue'; // Importa HomePage.vue

export default defineComponent({
  components: {
    IonApp,
    HomePage, // Registra HomePage como un componente
  },
});
</script>

<style>
/* Estilos globales (opcional) */
</style>