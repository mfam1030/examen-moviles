import axios from 'axios';

const token = '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'; // Reemplaza con tu token de GitHub

export default {
  async searchRandomRepo(language) {
    const url = `https://api.github.com/search/repositories?q=language:${language}&sort=stars&order=desc`;
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      const repos = response.data.items;
      const randomRepo = repos[Math.floor(Math.random() * repos.length)];
      return randomRepo;
    } catch (error) {
      console.error('Error fetching repositories', error);
      throw error;
    }
  },
};