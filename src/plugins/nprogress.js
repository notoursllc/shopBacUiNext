import NProgress from 'nprogress';

export default {
    install: (app, { router }) => {
        router.beforeEach((to, from) => {
            if (to.path !== from.path) {
                NProgress.start()
            }
        });

        router.afterEach(() => {
            NProgress.done();
        });
    }
};