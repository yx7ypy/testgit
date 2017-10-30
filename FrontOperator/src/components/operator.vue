<template>
	<div class="operator-wrap">
		<headernav></headernav>
		<router-view></router-view>
	</div>
</template>

<script>
import '@/static/style/base/base.scss'
import headernav from '@/components/navmenu/headernav.vue'

export default {
  	name: 'operator',
	components: { headernav }
}
</script>
