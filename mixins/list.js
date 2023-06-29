import SearchQuery from '@/components/hf/search-query.vue';
export default {
	components: {
		SearchQuery
	},
	data() {
		return {
			searchForm: {},
			searchParams: {},
		}
	},
	methods: {
		refreshList() {
			this.$refs.hfList && this.$refs.hfList.getList(true);
		},
		reset() {
			this.searchForm = {};
			this.searchParams = {
				...this.searchForm
			};
			this.refreshList();
		},
		search() {
			this.searchParams = {
				...this.searchForm
			};
			this.refreshList();
		},
	}
}
