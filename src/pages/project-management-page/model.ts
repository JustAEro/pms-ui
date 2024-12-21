import { attach, combine, createEvent, createStore, sample } from 'effector';
import stringify from 'json-stable-stringify';
import { combineEvents, or, spread } from 'patronum';

import {
  type Project,
  addMemberToProjectMockFx,
  archiveProjectFx,
  deleteMemberFromProjectMockFx,
  editProjectMockFx,
  fetchAdminsOfProjectMockFx,
  fetchMembersOfProjectMockFx,
  fetchProjectFx,
  unarchiveProjectFx,
  updateAdminsOfProjectMockFx,
} from '@pms-ui/entities/project';
import { type User, $userType } from '@pms-ui/entities/user';
import { routes } from '@pms-ui/shared/routes';
import { modal } from '@pms-ui/shared/ui';
import { header as pageHeader } from '@pms-ui/widgets/header';

const reset = createEvent();

export const pageMounted = createEvent();
export const pageUnmounted = createEvent();

export const addUserToProjectButtonClicked = createEvent();
export const confirmAddUserToProjectButtonClicked = createEvent();

export const backToProjectButtonClicked = createEvent();

export const deleteUserFromProjectButtonClicked = createEvent<User>();
export const confirmDeleteUserFromProjectButtonClicked =
  createEvent<User['id']>();

export const confirmEditProjectButtonClicked = createEvent();

export const confirmArchiveProjectButtonClicked = createEvent();

export const saveChangesButtonClicked = createEvent();
export const discardChangesButtonClicked = createEvent();

export const projectNameInEditModalChanged = createEvent<string>();
export const projectDescriptionInEditModalChanged = createEvent<string>();

export const addUserLoginFieldValueChanged = createEvent<string>();

export const adminCheckboxChecked = createEvent<User['id']>();

const fetchProjectScopedFx = attach({ effect: fetchProjectFx });
const fetchMembersOfProjectScopedFx = attach({
  effect: fetchMembersOfProjectMockFx,
});
const fetchAdminsOfProjectScopedFx = attach({
  effect: fetchAdminsOfProjectMockFx,
});
const editProjectScopedFx = attach({ effect: editProjectMockFx });
const deleteMemberFromProjectScopedFx = attach({
  effect: deleteMemberFromProjectMockFx,
});
const addMemberToProjectScopedFx = attach({ effect: addMemberToProjectMockFx });
const archiveProjectScopedFx = attach({ effect: archiveProjectFx });
const unarchiveProjectScopedFx = attach({ effect: unarchiveProjectFx });
const updateAdminsOfProjectScopedFx = attach({
  effect: updateAdminsOfProjectMockFx,
});

export const $project = createStore<Project | null>(null);
export const $isProjectArchived = $project.map(
  (project) => project?.isArchived ?? null
);
export const $isProjectLoading = fetchProjectScopedFx.pending;
export const $isProjectEditInProgress = editProjectScopedFx.pending;

export const $membersOfProject = createStore<User[]>([]);
export const $adminsOfProject = createStore<User[]>([]);
export const $isMembersOfProjectLoading = or(
  fetchMembersOfProjectScopedFx.pending,
  fetchAdminsOfProjectScopedFx.pending
);

export const $adminsMap = createStore<Record<User['id'], boolean>>({});
const $loadedFromServerAdminsMap = createStore<Record<User['id'], boolean>>({});

export const $userToBeDeleted = createStore<User | null>(null);

export const $editProjectModalName = createStore('');
export const $editProjectModalDescription = createStore('');

export const $addUserLoginFieldValue = createStore('');

export const $isConfirmEditProjectButtonDisabled = or(
  combine(
    $editProjectModalName,
    $editProjectModalDescription,
    $project,
    (newName, newDescription, project) =>
      newName === project?.name && newDescription === project?.description
  ),
  $isProjectEditInProgress
);

export const $isSaveChangesAndCancelChangesButtonsDisabled = or(
  combine(
    $adminsMap,
    $loadedFromServerAdminsMap,
    (adminsMap, loadedFromServerAdminsMap) =>
      stringify(adminsMap) === stringify(loadedFromServerAdminsMap)
  ),
  updateAdminsOfProjectScopedFx.pending
);

export const $isUpdateAdminsOfProjectInProgress =
  updateAdminsOfProjectScopedFx.pending;

export const headerModel = pageHeader.model.createModel({ $userType });

export const archiveProjectModal = modal.model.createModel();
export const addUserModal = modal.model.createModel();
export const editProjectModal = modal.model.createModel();
export const deleteFromProjectModal = modal.model.createModel();

sample({
  clock: [
    pageMounted,
    routes.projectManagementRoute.opened,
    routes.projectManagementRoute.updated,
  ],
  source: {
    userType: $userType,
    pageParams: routes.projectManagementRoute.$params,
  },
  filter: ({ userType }) => userType === 'user',
  fn: ({ pageParams }) => ({ projectId: pageParams.projectId }),
  target: [
    fetchProjectScopedFx,
    fetchMembersOfProjectScopedFx,
    fetchAdminsOfProjectScopedFx,
  ] as const,
});

sample({
  clock: fetchProjectScopedFx.doneData,
  target: $project,
});

sample({
  clock: fetchProjectScopedFx.doneData,
  fn: (project) => {
    const { name, description } = project;

    return {
      $editProjectModalDescription: description,
      $editProjectModalName: name,
    };
  },
  target: spread({
    $editProjectModalDescription,
    $editProjectModalName,
  }),
});

sample({
  clock: fetchMembersOfProjectScopedFx.doneData,
  target: $membersOfProject,
});

sample({
  clock: fetchAdminsOfProjectScopedFx.doneData,
  target: $adminsOfProject,
});

sample({
  clock: combineEvents({
    users: fetchMembersOfProjectScopedFx.doneData,
    admins: fetchAdminsOfProjectScopedFx.doneData,
  }),
  fn: ({ users, admins }) =>
    Object.fromEntries(
      users.map((user) => [
        user.id,
        !!admins.find((admin) => admin.id === user.id),
      ])
    ),
  target: [$adminsMap, $loadedFromServerAdminsMap],
});

sample({
  clock: adminCheckboxChecked,
  source: {
    adminsMap: $adminsMap,
  },
  fn: ({ adminsMap }, userId) => {
    const newChecked = !adminsMap[userId];

    return {
      ...adminsMap,
      [userId]: newChecked,
    };
  },
  target: $adminsMap,
});

sample({
  clock: projectNameInEditModalChanged,
  target: $editProjectModalName,
});

sample({
  clock: projectDescriptionInEditModalChanged,
  target: $editProjectModalDescription,
});

sample({
  clock: editProjectModal.inputs.close,
  source: {
    project: $project,
  },
  fn: ({ project }) => ({
    $editProjectModalName: project?.name ?? '',
    $editProjectModalDescription: project?.description ?? '',
  }),
  target: spread({
    $editProjectModalName,
    $editProjectModalDescription,
  }),
});

sample({
  clock: confirmEditProjectButtonClicked,
  source: {
    pageParams: routes.projectManagementRoute.$params,
    name: $editProjectModalName,
    description: $editProjectModalDescription,
    currentProject: $project,
  },
  fn: ({ pageParams, name, description, currentProject }) => {
    const project: Project = {
      id: pageParams.projectId,
      name,
      description,
      isArchived: currentProject!.isArchived,
    };

    return project;
  },
  target: editProjectScopedFx,
});

sample({
  clock: editProjectScopedFx.doneData,
  fn: (project) => {
    const { name, description } = project;

    return {
      $project: project,
      $editProjectModalDescription: description,
      $editProjectModalName: name,
    };
  },
  target: spread({
    $project,
    $editProjectModalName,
    $editProjectModalDescription,
  }),
});

sample({
  clock: editProjectScopedFx.doneData,
  target: editProjectModal.inputs.close,
});

sample({
  clock: addUserToProjectButtonClicked,
  target: addUserModal.inputs.open,
});

sample({
  clock: addUserLoginFieldValueChanged,
  target: $addUserLoginFieldValue,
});

sample({
  clock: confirmAddUserToProjectButtonClicked,
  source: $addUserLoginFieldValue,
  target: addMemberToProjectScopedFx,
});

sample({
  clock: addMemberToProjectScopedFx.doneData,
  source: $membersOfProject,
  fn: (members, newMember) => [...members, newMember],
  target: [$membersOfProject, addUserModal.inputs.close] as const,
});

sample({
  clock: addUserModal.inputs.close,
  target: $addUserLoginFieldValue.reinit,
});

sample({
  clock: backToProjectButtonClicked,
  source: routes.projectManagementRoute.$params,
  target: routes.projectRoute.open,
});

sample({
  clock: deleteUserFromProjectButtonClicked,
  target: [deleteFromProjectModal.inputs.open, $userToBeDeleted] as const,
});

sample({
  clock: confirmDeleteUserFromProjectButtonClicked,
  target: deleteMemberFromProjectScopedFx,
});

sample({
  clock: deleteMemberFromProjectScopedFx.done,
  source: $membersOfProject,
  fn: (members, { params: userId }) => {
    const newMembers = members.filter((user) => user.id !== userId);

    return newMembers;
  },
  target: [$membersOfProject, deleteFromProjectModal.inputs.close] as const,
});

sample({
  clock: confirmArchiveProjectButtonClicked,
  source: $project,
  filter: (project) => !!project && !project.isArchived,
  fn: (project) => ({ projectId: project!.id }),
  target: archiveProjectScopedFx,
});

sample({
  clock: archiveProjectScopedFx.doneData,
  fn: (project) => ({
    ...project,
  }),
  target: [$project, archiveProjectModal.inputs.close] as const,
});

sample({
  clock: confirmArchiveProjectButtonClicked,
  source: $project,
  filter: (project) => !!project && project.isArchived,
  fn: (project) => ({ projectId: project!.id }),
  target: unarchiveProjectScopedFx,
});

sample({
  clock: unarchiveProjectScopedFx.doneData,
  fn: (project) => ({
    ...project,
  }),
  target: [$project, archiveProjectModal.inputs.close] as const,
});

sample({
  clock: saveChangesButtonClicked,
  source: $adminsMap,
  fn: (adminsMap) =>
    Object.keys(
      Object.fromEntries(
        Object.entries(adminsMap).filter(([, isAdmin]) => isAdmin)
      )
    ),
  target: updateAdminsOfProjectScopedFx,
});

sample({
  clock: updateAdminsOfProjectScopedFx.doneData,
  source: $membersOfProject,
  fn: (members, admins) =>
    Object.fromEntries(
      members.map((user) => [
        user.id,
        !!admins.find((admin) => admin.id === user.id),
      ])
    ),
  target: [$loadedFromServerAdminsMap, $adminsMap],
});
$loadedFromServerAdminsMap.watch(console.log);
$adminsMap.watch(console.log);

sample({
  clock: discardChangesButtonClicked,
  source: $loadedFromServerAdminsMap,
  target: $adminsMap,
});

sample({
  clock: [pageUnmounted, routes.projectManagementRoute.closed],
  target: reset,
});

sample({
  clock: reset,
  target: [
    $project.reinit,
    $adminsMap.reinit,
    $membersOfProject.reinit,
    $adminsOfProject.reinit,
    $loadedFromServerAdminsMap.reinit,
  ] as const,
});

fetchProjectScopedFx.fail.watch(console.log);
fetchProjectScopedFx.doneData.watch(console.log);
$project.watch(console.log);
