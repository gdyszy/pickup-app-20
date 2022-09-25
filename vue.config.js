const ignored = ['**/uni_modules/**/*.md', '**/uni_modules/**/package.json','**/uni_modules/*/uniCloud/**/*']
process.env.UNI_CLOUD_PROVIDER = JSON.stringify([{
		provider: 'aliyun',
		spaceId: '82809ea8-bc7d-40a4-808a-a22d30c9fdcd',
		clientSecret: 'WU/H9qhBRNx7CKEaNvuQYg==',
		endpoint: 'https://api.bspapp.com'
	}])
module.exports = {
	configureWebpack() {
		return {
			watchOptions: {
				ignored
			},
			devServer: {
				watchOptions: {
					ignored
				}
			}
		}
	}
}
