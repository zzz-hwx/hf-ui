export default {
	mounted() {
		// #ifdef MP-WEIXIN
		this.$refs.hfList.setFetchList(this.fetchList);
		// #endif
	},
	onShow() {
		this.refreshList();
	},
	onPullDownRefresh() {
		this.refreshList();
	},
	methods: {
		refreshList() {
			if (this.$refs.hfList && this.$refs.hfList.refreshList) {
				this.$refs.hfList.refreshList();
			} else if (this.$refs.hfList && this.$refs.hfList.getList) {
				this.$refs.hfList.getList(true);
			}
		}
	}
}
