// Composables
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { useUserStore } from "@/store/user.store";
import { GalleryType } from "@/gql/graphql";

const routes = [
  {
    path: "/",
    component: () => import("@/layouts/default/Default.vue"),
    children: [
      {
        path: "/invite/:id",
        name: "Join Chat",
        component: () => import("@/views/Communications/Join.vue")
      },
      {
        path: "/social",
        name: "Social Hub",
        component: () => import("@/views/Communications/Home.vue")
      },
      {
        path: "/communications/home",
        name: "Communications Home (Social Hub)",
        component: () => import("@/views/Communications/Home.vue")
      },
      {
        path: "/communications",
        name: "Communications",
        component: () => import("@/layouts/communications/Comms.vue"),
        redirect: "/communications/home",
        children: [
          {
            path: ":chatId",
            name: "Communication",
            component: () => import("@/views/Communications/Chat.vue")
          }
        ]
      },
      {
        path: "/mail",
        name: "Mail",
        component: () => import("@/layouts/mail/Mail.vue"),
        redirect: "/mail/home",
        children: [
          {
            path: ":mailbox",
            name: "Mailbox",
            component: () => import("@/views/Mail/Mailbox.vue"),
            children: [
              {
                path: ":messageId",
                name: "Message",
                component: () => import("@/views/Mail/Message.vue")
              }
            ]
          },
          {
            path: "home",
            name: "Mail Home",
            component: () => import("@/views/Mail/Home.vue")
          }
        ]
      },
      {
        path: "/",
        name: "Dashboard",
        component: () => import("@/views/HomeHandler.vue")
      },
      {
        path: "/dashboard",
        name: "Dashboard Redirect",
        redirect: "/"
      },
      {
        path: "/gallery/:page?",
        name: "Personal Gallery",
        component: () => import("@/views/Gallery.vue"),
        props: {
          type: GalleryType.Personal,
          path: "/gallery",
          name: "Gallery"
        }
      },
      {
        path: "/collections",
        name: "Collections",
        component: () => import("@/views/Collections/Home.vue")
      },
      {
        path: "/collections/share/:id/:page?",
        name: "Collection Share",
        redirect: (to: any) =>
          `/collections/${to.params.id}${
            to.params.page ? "/" + to.params.page : ""
          }`
      },
      {
        path: "/collections/:id/:page?",
        name: "Collection Item",
        component: () => import("@/views/Collections/Item.vue")
      },
      {
        path: "/settings",
        name: "Settings",
        component: () => import("@/views/Settings/Settings.vue"),
        redirect: "/settings/dashboard",
        children: [
          {
            path: "dashboard",
            name: "Dashboard Settings",
            component: () => import("@/views/Settings/Home.vue")
          },
          {
            path: "security",
            name: "Security",
            component: () => import("@/views/Settings/Security.vue")
          },
          {
            path: "clients",
            name: "Setup",
            component: () => import("@/views/Settings/Setup.vue")
          },
          {
            path: "about",
            name: "About",
            component: () => import("@/views/Settings/About.vue")
          },
          {
            path: "domains",
            name: "Domains",
            component: () => import("@/views/Settings/Domains.vue")
          },
          {
            path: "slideshows",
            name: "Slideshows",
            component: () => import("@/views/Settings/Slideshows.vue")
          },
          {
            path: "integrations",
            name: "Integrations",
            component: () => import("@/views/Settings/Integrations.vue")
          },
          {
            path: "integrations/link/:provider",
            name: "Link Integration",
            component: () => import("@/views/Settings/IntegrationsLink.vue")
          },
          {
            path: "developer",
            name: "Developer Portal",
            component: () => import("@/views/Admin/Oauth.vue")
          },
          {
            path: "developer/:id",
            name: "Developer Portal App",
            component: () => import("@/views/Admin/OauthItem.vue")
          },
          {
            path: "privacy",
            name: "Privacy",
            component: () => import("@/views/Settings/Privacy.vue")
          },
          {
            path: "desktop",
            name: "Desktop",
            component: () => import("@/views/Settings/Desktop.vue")
          },
          {
            path: "subscriptions",
            name: "Subscriptions & Billing",
            component: () => import("@/views/Settings/Subscriptions.vue")
          }
        ]
      },
      {
        path: "/autoCollect",
        name: "AutoCollects",
        component: () => import("@/views/AutoCollects/Home.vue")
      },
      {
        path: "/autoCollect/configure",
        name: "AutoCollects Configure",
        component: () => import("@/views/AutoCollects/Configure.vue")
      },
      {
        path: "/autoCollect/:id/:page?",
        name: "AutoCollect",
        component: () => import("@/views/AutoCollects/Item.vue")
      },
      {
        path: "/notes",
        name: "Notes Workspaces Redirect",
        redirect: "/workspaces"
      },
      {
        path: "/notes/:id",
        name: "Note",
        redirect: (to: any) => `/workspaces/notes/${to.params.id}`
      },
      {
        path: "/workspaces",
        name: "Workspaces",
        component: () => import("@/views/Workspaces/WorkspaceHome.vue")
      },
      {
        path: "/workspaces/notes/:id/:version?",
        name: "Workspace Item",
        component: () => import("@/views/Workspaces/WorkspaceItemHandler.vue")
      },
      {
        path: "/users",
        name: "Users",
        component: () => import("@/views/User/Home.vue")
      },
      {
        path: "/u/:username",
        name: "User",
        component: () => import("@/views/User/User.vue")
      },
      {
        path: "/starred/:page?",
        name: "Starred",
        component: () => import("@/views/Gallery.vue"),
        props: {
          type: GalleryType.Starred,
          path: "/starred",
          name: "Starred"
        }
      },
      {
        path: "/slideshow/:code",
        name: "Slideshow",
        component: () => import("@/views/Slideshow.vue")
      },
      {
        path: "/admin",
        name: "Admin",
        redirect: "/admin/dashboard",
        component: () => import("@/views/Admin/Admin.vue"),
        children: [
          {
            path: "dashboard",
            name: "Admin Dashboard",
            component: () => import("@/views/Admin/Dashboard.vue")
          },
          {
            path: "services",
            name: "Admin Services",
            component: () => import("@/views/Admin/Services.vue")
          },
          {
            path: "dev",
            name: "Admin Developer Options",
            component: () => import("@/views/Admin/Dev.vue")
          },
          {
            path: "users",
            name: "Admin Users",
            component: () => import("@/views/Admin/Users.vue")
          },
          {
            path: "cache",
            name: "Admin Cache",
            component: () => import("@/views/Admin/Cache.vue")
          },
          {
            path: "badges",
            name: "Admin Badges",
            component: () => import("@/views/Admin/Badges.vue")
          },
          {
            path: "autoCollect",
            name: "Admin AutoCollects",
            component: () => import("@/views/Admin/AutoCollect.vue")
          },
          {
            path: "communications",
            name: "Admin Communications",
            component: () => import("@/views/Admin/Communications.vue")
          },
          {
            path: "domains",
            name: "Admin Domains",
            component: () => import("@/views/Admin/Domains.vue")
          },
          {
            path: "invites",
            name: "Admin Invite a Friend",
            component: () => import("@/views/Admin/IAF.vue")
          },
          {
            path: "oauth",
            name: "Admin AppAuth",
            component: () => import("@/views/Admin/Oauth.vue")
          },
          {
            path: "oauth/:id",
            name: "Admin AppAuth Item",
            component: () => import("@/views/Admin/OauthItem.vue")
          }
        ]
      },
      {
        path: "/insights",
        name: "Insights",
        component: () => import("@/views/Insights/Home.vue")
      },
      {
        path: "/insights/:type/:username?",
        name: "Weekly Insights",
        component: () => import("@/views/Insights/Weekly.vue")
      },
      {
        path: "/changeLog",
        name: "Changelog",
        component: () => import("@/views/Changelog.vue")
      },
      // Unauthenticated
      {
        path: "/verify/:token",
        name: "Email Verify",
        component: () => import("@/views/Auth/EmailVerify.vue")
      },
      {
        path: "/login",
        name: "Login",
        component: () => import("@/views/Auth/Login.vue")
      },
      {
        path: "/register/:key?",
        name: "Register",
        component: () => import("@/views/Auth/Register.vue")
      },
      {
        path: "/home",
        name: "Home",
        redirect: "/"
      },
      {
        path: "/passwordReset/:code",
        name: "Password Reset",
        component: () => import("@/views/Auth/PasswordReset.vue")
      },
      {
        path: "/policies/content",
        name: "Content Policy",
        component: () => import("@/views/Policies/Content.vue")
      },
      {
        path: "/policies/privacy",
        name: "Privacy Policy",
        component: () => import("@/views/Policies/Privacy.vue")
      },
      {
        path: "/credits",
        name: "Credits",
        component: () => import("@/views/Credits.vue")
      },
      {
        path: "/setup",
        name: "TPU Setup Wizard",
        component: () => import("@/views/Setup.vue")
      },
      {
        path: "/oauth/:oauthAppId?",
        name: "OAuth",
        component: () => import("@/views/Auth/Oauth.vue")
      },
      {
        path: "/downloads",
        name: "Downloads",
        component: () => import("@/views/Downloads.vue")
      },
      {
        path: "/download",
        redirect: "/downloads",
        name: "Download Redirect"
      },
      {
        path: "/news",
        name: "News",
        component: () => import("@/views/News/NewsHome.vue")
      },
      {
        path: "/news/:id",
        name: "News Item",
        component: () => import("@/views/News/NewsItem.vue")
      },
      {
        // any :value/*****
        path: "/forms/:pathMatch(.*)?",
        name: "Forms",
        component: () => import("@/views/ModuleEntry.vue"),
        props: {
          id: "flowforms-app"
        }
      },
      {
        path: "/e/:experiment/:value",
        name: "Experiment Set",
        component: () => import("@/views/Admin/SetExperimentRedirect.vue")
      },
      {
        path: "/:id",
        name: "Attachment Item",
        component: () => import("@/views/Item.vue")
      },
      {
        path: "/:pathMatch(.*)",
        name: "404",
        component: () => import("@/views/Errors/404.vue")
      }
    ]
  }
] as RouteRecordRaw[];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach(async (to, from) => {
  const user = useUserStore();
  // If there's a token, and _postInitRan hasn't been set to true yet, we shouldn't redirect. But if $user.user is null and _postInitRan is true, we should redirect.
  if (!user._postInitRan) return;
  if (
    !user.user &&
    ![
      "Login",
      "Home",
      "Dashboard",
      "Register",
      "404",
      "Collection Item",
      "Content Policy",
      "Slideshow",
      "Password Reset",
      "Email Verify",
      "Workspace Item",
      "Note",
      "Notes Workspaces Redirect",
      "Privacy Policy",
      "Attachment Item",
      "Credits",
      "TPU Setup Wizard",
      "User",
      "OAuth",
      "Join Chat",
      "Download Redirect",
      "Downloads",
      "Experiment Set"
    ].includes(to.name as string)
  ) {
    console.log("Redirecting to login");
    return { name: "Dashboard" };
  } else if (
    user.user &&
    ["Home", "Login", "Register"].includes(to.name as string)
  ) {
    console.log("Redirecting to dashboard");
    return { name: "Dashboard" };
  }
});

export default router;
