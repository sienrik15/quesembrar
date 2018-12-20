<template>
    <div id="app">
        <div class="app-body">
            <main class="main">
                <router-view></router-view>
            </main>

        </div>
        <!--footer-->
    </div>
</template>

<script>
    export default {
        name: "DefaultContainer",
        computed: {
            name () {
                return this.$route.name
            }
        }
    }
</script>

<style scoped>

</style>