<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>GitHub Repository Finder</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-item>
        <ion-label>Select a Language</ion-label>
        <ion-select v-model="lenguajeSeleccionado" interface="popover" class="seleccion-personalizada">
          <ion-select-option v-for="lenguaje in lenguajes" :key="lenguaje.value" :value="lenguaje.value">
            {{ lenguaje.title }}
          </ion-select-option>
        </ion-select>
      </ion-item>

      <ion-button v-if="!repositorio" expand="full" @click="buscarRepositorio" class="boton-buscar">
        Search Repository
      </ion-button>

      <div v-if="cargando" class="mensaje-cargando">Loading, please wait...</div>
      <div v-if="error" class="mensaje-error">Error fetching repositories. Click to retry.</div>

      <div v-if="repositorio" class="info-repositorio">
        <h2>{{ repositorio.name }}</h2>
        <p>{{ repositorio.description }}</p>
        <div class="estadisticas">
          <span><ion-icon name="star-sharp"></ion-icon> Stars: {{ repositorio.stargazers_count }}</span>
          <span><ion-icon name="git-branch-sharp"></ion-icon> Forks: {{ repositorio.forks_count }}</span>
          <span><ion-icon name="alert-sharp"></ion-icon>Open Issues: {{ repositorio.open_issues_count }}</span>
        </div>
        <ion-button expand="full" @click="buscarRepositorio" class="boton-refrescar">
          Refresh
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonSelect, IonSelectOption, IonButton } from '@ionic/vue';
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonButton
  },
  setup() {
    const lenguajes = ref([]);
    const lenguajeSeleccionado = ref('');
    const repositorio = ref(null);
    const cargando = ref(false);
    const error = ref(false);

    const obtenerLenguajes = async () => {
      try {
        const response = await axios.get('https://raw.githubusercontent.com/kamranahmedse/githunt/master/src/components/filters/language-filter/languages.json');
        // La API devuelve un objeto, no un arreglo
        lenguajes.value = Object.entries(response.data).map(([key, value]) => ({
          title: value.title, 
          value: value.title.toLowerCase(), // Usa el título en minúsculas como valor
        }));
        console.log('Lenguajes cargados:', lenguajes.value); // Depuración
      } catch (err) {
        console.error('Error fetching languages:', err);
      }
    };

    const buscarRepositorio = async () => {
      if (!lenguajeSeleccionado.value) {
        alert('Please select a language.');
        return;
      }

      cargando.value = true;
      error.value = false;
      repositorio.value = null;

      try {
        const query = `language:${lenguajeSeleccionado.value}`;
        const response = await axios.get('https://api.github.com/search/repositories', {
          params: { q: query, sort: 'stars', order: 'desc' },
          headers: {
            Authorization: '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', 
          },
        });
        const repos = response.data.items;
        if (repos.length > 0) {
          repositorio.value = repos[Math.floor(Math.random() * repos.length)];
          console.log('Repositorio encontrado:', repositorio.value); 
        } else {
          error.value = true;
        }
      } catch (err) {
        error.value = true;
        console.error('Error fetching repositories:', err);
      } finally {
        cargando.value = false;
      }
    };

    onMounted(() => {
      obtenerLenguajes();
    });

    return {
      lenguajes,
      lenguajeSeleccionado,
      repositorio,
      cargando,
      error,
      buscarRepositorio
    };
  }
};
</script>

<style scoped>
.mensaje-cargando, .mensaje-error {
  text-align: center;
  margin-top: 20px;
}

.info-repositorio {
  padding: 20px;
}

.estadisticas {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
}
.estadisticas ion-icon {
  color: white;
}

</style>