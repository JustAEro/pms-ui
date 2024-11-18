import { attach, combine, createEvent, createStore, sample } from 'effector';
import { or, spread } from 'patronum';

import {
  type Project,
  addMemberToProjectMockFx,
  deleteMemberFromProjectMockFx,
  editProjectMockFx,
  fetchMembersOfProjectMockFx,
  fetchProjectFx,
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

export const projectNameInEditModalChanged = createEvent<string>();
export const projectDescriptionInEditModalChanged = createEvent<string>();

export const addUserLoginFieldValueChanged = createEvent<string>();

const fetchProjectScopedFx = attach({ effect: fetchProjectFx });
const fetchMembersOfProjectScopedFx = attach({
  effect: fetchMembersOfProjectMockFx,
});
const editProjectScopedFx = attach({ effect: editProjectMockFx });
const deleteMemberFromProjectScopedFx = attach({
  effect: deleteMemberFromProjectMockFx,
});
const addMemberToProjectScopedFx = attach({ effect: addMemberToProjectMockFx });

export const $project = createStore<Project | null>(null);
export const $isProjectLoading = fetchProjectScopedFx.pending;
export const $isProjectEditInProgress = editProjectScopedFx.pending;

export const $membersOfProject = createStore<User[]>([]);
export const $isMembersOfProjectLoading = fetchMembersOfProjectScopedFx.pending;

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
  target: [fetchProjectScopedFx, fetchMembersOfProjectScopedFx] as const,
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
  },
  fn: ({ pageParams, name, description }) => {
    const project: Project = {
      id: pageParams.projectId,
      name,
      description,
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
  clock: [pageUnmounted, routes.projectManagementRoute.closed],
  target: reset,
});

fetchProjectScopedFx.fail.watch(console.log);
fetchProjectScopedFx.doneData.watch(console.log);
$project.watch(console.log);
