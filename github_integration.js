const axios = require("axios");
require("dotenv").config();

const fetchGitHubMetrics = async () => {
    const headers = {
        Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,

    };

    try {
        // Dobim podatke o uporabniku
        const userResponse = await axios.get("https://api.github.com/user", { headers });
        const user = userResponse.data;

        // Dobimo vse repozitorije
        const reposResponse = await axios.get(user.repos_url, { headers });
        const repositories = reposResponse.data;

        let totalCommits = 0;
        let totalStars = 0;
        let totalWatchers = 0;

        // Preštejem commits, zvezdice in watcher-je za vse repozitorije
        for (const repo of repositories) {
            totalStars += repo.stargazers_count;
            totalWatchers += repo.watchers_count;

            // Dobim število commitov v glavnem branchu
            try {
                const commitsResponse = await axios.get(
                    `https://api.github.com/repos/${user.login}/${repo.name}/commits`,
                    { headers }
                );
                totalCommits += commitsResponse.data.length;
            } catch (error) {
                console.log(`Could not fetch commits for ${repo.name}:`, error.message);
            }
        }

        return {
            repositories: user.public_repos,
            followers: user.followers,
            commits: totalCommits,
            stars: totalStars,
            watchers: totalWatchers,
        };
    } catch (error) {
        console.log("Error fetching GitHub metrics:", error.message);
        return null;
    }
};

module.exports = fetchGitHubMetrics;
