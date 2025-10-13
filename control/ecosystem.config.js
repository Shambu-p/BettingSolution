module.exports = {
	apps: [{
		name: "betting_solution_control",
		script: "/home/shambel/Projects/BettingSolution/control/server.js",
		env: {
			NODE_ENV: "development",
		},
		env_staging: {
			NODE_ENV: "staging",
			PORT: 4000,
		},
		env_production: {
			NODE_ENV: "production",
			PORT: 4000,
		}
	}]
}
