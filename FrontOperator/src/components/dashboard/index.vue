<template>
    <div class="content" :class="model === 'icon' ? 'content-icon' : ''">
        <elmenu type="dashboard"></elmenu>
        <div class="right-content">
            <feng-breadcrumb></feng-breadcrumb>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import elmenu from '@/components/navmenu/elmenu.vue'
import fengBreadcrumb from '@/components/fengModule/breadcrumb.vue'

export default {
    data() {
        return {}
    },
    created() {
//      this.$store.dispatch('switchNavigation')
    },
    computed: {
        model() { return this.$store.getters.model }
    },
    components: {
        elmenu,
        fengBreadcrumb
    }
}
</script>
