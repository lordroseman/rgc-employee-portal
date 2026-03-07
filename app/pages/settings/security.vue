<script setup lang="ts">
import { useToast } from "primevue/usetoast";

definePageMeta({
  title: "Account Security",
});

useHead({
  title: "Account Security | My Portal",
});

const config = useRuntimeConfig();
const toast = useToast();

// ── Account Details ──────────────────────────────────────────────────────────
const authStore = useAuthStore();
const user = computed(() => authStore.user);
const showPasswordForm = ref(false);

// ── Change Password ──────────────────────────────────────────────────────────
const passwordForm = reactive({
  currentPassword: "",
  newPassword: "",
  newPassword_confirmation: "",
});
const passwordErrors = ref<Record<string, string[]>>({});
const passwordLoading = ref(false);

const changePassword = async () => {
  passwordErrors.value = {};
  passwordLoading.value = true;

  try {
    const response = await useAuthFetch(
      `${config.public.iamApiUrl}/api/user/change-password`,
      {
        method: "POST",
        body: passwordForm,
      }
    );

    if (response.success) {
      toast.add({
        severity: "success",
        summary: "Password updated",
        detail: "Your password has been changed successfully.",
        life: 3000,
      });
      passwordForm.currentPassword = "";
      passwordForm.newPassword = "";
      passwordForm.newPassword_confirmation = "";
      showPasswordForm.value = false;
    } else {
      passwordErrors.value = (response.errors as Record<string, string[]>) ?? {};
      toast.add({
        severity: "error",
        summary: "Failed",
        detail: "Please fix the errors below.",
        life: 3000,
      });
    }
  } catch (error: unknown) {
    const data = (error as {
      data?: { message?: string; errors?: Record<string, string[]> };
    })?.data;

    if (data?.errors) {
      passwordErrors.value = data.errors;
      toast.add({
        severity: "error",
        summary: "Failed",
        detail: "Please fix the errors below.",
        life: 3000,
      });
    } else if (data?.message) {
      passwordErrors.value = { currentPassword: [data.message] };
      toast.add({
        severity: "error",
        summary: "Failed",
        detail: data.message,
        life: 3000,
      });
    } else {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "Something went wrong. Please try again.",
        life: 3000,
      });
    }
  } finally {
    passwordLoading.value = false;
  }
};

// ── Google Account ───────────────────────────────────────────────────────────
const googleLoading = ref(false);
const googleLinked = computed(() => !!user.value?.google_email);

const bindGoogle = async () => {
  googleLoading.value = true;
  const response = await useAuthFetch<{ url: string }>(
    `${config.public.iamApiUrl}/api/user/google/connect/init`,
    { method: "POST" }
  );
  googleLoading.value = false;

  if (!response.success) {
    toast.add({
      severity: "error",
      summary: "Failed",
      detail: "Could not initiate Google connection.",
      life: 3000,
    });
    return;
  }

  window.open(response.data.url, "google-connect", "width=500,height=600");
};

async function onMessage(event: MessageEvent) {
  if (event.origin !== config.public.iamApiUrl) return;
  if (event.data?.type !== "google-connect-result") return;

  if (event.data.success) {
    await authStore.fetchUser();
    toast.add({
      severity: "success",
      summary: "Linked",
      detail: "Your Google account has been connected.",
      life: 3000,
    });
  } else {
    toast.add({
      severity: "error",
      summary: "Failed",
      detail: event.data.message ?? "Google connection failed.",
      life: 3000,
    });
  }
}

onMounted(() => window.addEventListener("message", onMessage));
onUnmounted(() => window.removeEventListener("message", onMessage));

const unlinkGoogle = async () => {
  googleLoading.value = true;
  const response = await useAuthFetch(
    `${config.public.iamApiUrl}/api/user/social/google`,
    {
      method: "DELETE",
    }
  );
  if (response.success) {
    toast.add({
      severity: "success",
      summary: "Unlinked",
      detail: "Google account has been unlinked.",
      life: 3000,
    });
  }
  googleLoading.value = false;
};
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Back -->
    <div
      class="flex items-center text-white gap-2 cursor-pointer text-slate-500"
      @click="navigateTo('/settings')"
    >
      <i class="pi pi-arrow-left text-sm" />
      <span class="text-sm">Settings</span>
    </div>

    <!-- Account Details -->
    <Card>
      <template #header>
        <div class="flex items-center gap-2 px-4 pt-4">
          <div class="rounded-full bg-blue-50 p-2">
            <i class="pi pi-id-card text-blue-600" style="font-size: 16px" />
          </div>
          <span class="text-sm font-semibold text-slate-700">Account Details</span>
        </div>
      </template>
      <template #content>
        <div class="flex flex-col gap-3">
          <div class="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <div>
              <p class="text-xs text-slate-400">Username</p>
              <p class="font-medium text-slate-800">{{ user?.name || "—" }}</p>
            </div>
            <div>
              <p class="text-xs text-slate-400">Email</p>
              <p class="font-medium text-slate-800 break-all">{{ user?.email || "—" }}</p>
            </div>
          </div>

          <Divider class="my-1" />

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i class="pi pi-lock text-slate-400" style="font-size: 14px" />
              <span class="text-sm font-medium text-slate-700">Password</span>
            </div>
            <Button
              :label="showPasswordForm ? 'Cancel' : 'Change Password'"
              :severity="showPasswordForm ? 'secondary' : 'contrast'"
              size="small"
              outlined
              @click="showPasswordForm = !showPasswordForm"
            />
          </div>

          <form
            v-if="showPasswordForm"
            class="flex flex-col gap-4"
            @submit.prevent="changePassword"
          >
            <div class="flex flex-col gap-1">
              <label class="text-xs font-medium text-slate-500">Current Password</label>
              <Password
                v-model="passwordForm.currentPassword"
                :feedback="false"
                toggle-mask
                fluid
                input-class="w-full"
                :invalid="!!passwordErrors.currentPassword"
              />
              <small v-if="passwordErrors.currentPassword" class="text-red-500 text-xs">
                {{ passwordErrors.currentPassword[0] }}
              </small>
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-xs font-medium text-slate-500">New Password</label>
              <Password
                v-model="passwordForm.newPassword"
                toggle-mask
                fluid
                input-class="w-full"
                :invalid="!!passwordErrors.newPassword"
              />
              <small v-if="passwordErrors.newPassword" class="text-red-500 text-xs">
                {{ passwordErrors.newPassword[0] }}
              </small>
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-xs font-medium text-slate-500"
                >Confirm New Password</label
              >
              <Password
                v-model="passwordForm.newPassword_confirmation"
                :feedback="false"
                toggle-mask
                fluid
                input-class="w-full"
                :invalid="!!passwordErrors.newPassword_confirmation"
              />
              <small
                v-if="passwordErrors.newPassword_confirmation"
                class="text-red-500 text-xs"
              >
                {{ passwordErrors.newPassword_confirmation[0] }}
              </small>
            </div>

            <Button
              type="submit"
              label="Update Password"
              :loading="passwordLoading"
              class="w-full"
            />
          </form>
        </div>
      </template>
    </Card>

    <!-- Bind Google Account -->
    <Card>
      <template #header>
        <div class="flex items-center gap-2 px-4 pt-4">
          <div class="rounded-full bg-red-50 p-2">
            <svg class="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          </div>
          <span class="text-sm font-semibold text-slate-700">Google Account</span>
        </div>
      </template>
      <template #content>
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span
              :class="[
                'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
                googleLinked
                  ? 'bg-green-50 text-green-700'
                  : 'bg-slate-100 text-slate-500',
              ]"
            >
              <i
                :class="googleLinked ? 'pi pi-check-circle' : 'pi pi-circle'"
                class="text-xs"
              />
              {{ googleLinked ? "Linked" : "Not linked" }}
            </span>
            <span v-if="googleLinked" class="text-xs text-slate-500 truncate">
              {{ user?.google_email }}
            </span>
          </div>
          <p class="text-xs text-slate-400">
            {{
              googleLinked
                ? "Your Google account is connected. You can sign in with Google."
                : "Link your Google account to enable sign-in with Google."
            }}
          </p>

          <!-- Warning -->
          <div
            class="rounded-lg bg-amber-50 border border-amber-200 p-3 flex flex-col gap-1.5"
          >
            <div class="flex items-center gap-1.5 text-amber-700 text-xs font-semibold">
              <i class="pi pi-exclamation-triangle" style="font-size: 13px" />
              Important
            </div>
            <ul class="text-xs text-amber-700 list-disc list-inside space-y-1">
              <li>
                Only <span class="font-semibold">@ribshackcorp.com</span> email addresses
                are allowed.
              </li>
              <li>
                You must be the <span class="font-semibold">sole owner</span> of this
                Google account. Do not use a shared or public email — your payslips and
                personal information will be accessible to anyone who can sign in with it.
              </li>
            </ul>
          </div>
          <Button
            v-if="!googleLinked"
            label="Bind Ribshack Corp Google Account"
            outlined
            class="w-full"
            :loading="googleLoading"
            @click="bindGoogle"
          >
            <template #icon>
              <svg
                class="w-4 h-4 mr-2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            </template>
          </Button>
          <Button
            v-else
            label="Unlink Google Account"
            severity="danger"
            outlined
            class="w-full"
            :loading="googleLoading"
            @click="unlinkGoogle"
          />
        </div>
      </template>
    </Card>
  </div>
</template>
