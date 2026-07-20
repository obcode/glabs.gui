/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
/** The input shape the GUI should render for a field. */
export type FieldKind =
  | 'BOOL'
  | 'ENUM'
  | 'INT'
  | 'STRING'
  | 'STRINGLIST';

/** One field's drafted value, keyed by FieldMeta.key. Booleans as `true`/`false`; empty string unsets the field (so it inherits). */
export type FieldValueInput = {
  key: string;
  value: string;
};

export type FindingSeverity =
  /** It works, but the spelling or shape is obsolete. */
  | 'DEPRECATED'
  /** The setting is present but has no effect. */
  | 'PROBLEM';

/** A named group of members (emails), for setCourseGroups. */
export type GroupInput = {
  members: Array<string>;
  name: string;
};

/** The lifecycle state of a scheduled job. It starts PENDING, is claimed to RUNNING, and ends in exactly one terminal state. */
export type JobStatus =
  | 'CANCELLED'
  | 'DONE'
  | 'EXPIRED'
  | 'FAILED'
  | 'PENDING'
  | 'RUNNING';

/** The severity/kind of one streamed output line. */
export type LogLevel =
  | 'DONE'
  | 'ERROR'
  | 'INFO'
  | 'PROGRESS'
  | 'RESULT'
  | 'WARN';

/** A mutating GitLab operation. None of them touch git — pure GitLab API calls. */
export type Op =
  | 'ARCHIVE'
  | 'DELETE'
  | 'GENERATE'
  | 'PROTECT'
  | 'SETACCESS'
  | 'UPDATE';

/** Optional parameters for an operation (op-specific; unset fields fall back to the assignment config). */
export type OpParams = {
  /** setaccess: the access level to grant (guest|reporter|developer|maintainer). */
  accessLevel?: string | null | undefined;
  /** protect: the branch to protect. */
  branch?: string | null | undefined;
  /** generate: create repos and push starter code but do NOT add/invite students or groups (for debugging). */
  skipInvite?: boolean | null | undefined;
  /** archive: unarchive instead of archive. */
  unarchive?: boolean | null | undefined;
};

/** How a roster entry resolved against GitLab. */
export type StudentCheckStatus =
  /** Resolved by username — works, but pinning by ID is safer. */
  | 'DEPRECATED'
  /** Cannot resolve and there is no email to fall back to. */
  | 'ERROR'
  /** No GitLab user yet, but there is an email → will be invited. */
  | 'INVITE'
  /** Resolved (pinned by ID, or matched uniquely by email). */
  | 'OK';

export type AuthCheckQueryVariables = Exact<{ [key: string]: never; }>;


export type AuthCheckQuery = { me: { email: string } };

export type CourseCheckProgressSubscriptionVariables = Exact<{
  name: string;
}>;


export type CourseCheckProgressSubscription = { courseCheckProgress: { message: string, done: boolean, error: string | null, result: { course: string, errors: number, ok: boolean, students: Array<{ input: string, status: StudentCheckStatus, message: string }>, groups: Array<{ name: string, members: Array<{ input: string, status: StudentCheckStatus, message: string }> }>, duplicates: Array<{ student: string, groups: Array<string> }> } | null } };

export type RunOpSubscriptionVariables = Exact<{
  token: string;
  confirmPhrase?: string | null | undefined;
}>;


export type RunOpSubscription = { runOp: { level: LogLevel, text: string } };

export type AssignmentReportProgressSubscriptionVariables = Exact<{
  course: string;
  name: string;
}>;


export type AssignmentReportProgressSubscription = { assignmentReportProgress: { message: string, done: boolean, error: string | null, report: { course: string, assignment: string, url: string, description: string, generated: string | null, hasReleaseMergeRequest: boolean, hasReleaseDockerImages: boolean, projects: Array<{ name: string, active: boolean, emptyRepo: boolean, commits: number, lastActivity: string | null, webUrl: string, openIssuesCount: number, openMergeRequestsCount: number, members: Array<{ name: string, username: string, webUrl: string }>, lastCommit: { title: string, committerName: string, committedDate: string | null, webUrl: string } | null, release: { mergeRequest: { found: boolean, webUrl: string, pipelineStatus: string } | null, dockerImages: { status: string, images: Array<{ wanted: string, image: string | null }> } | null } | null }> } | null } };

export type CourseRepoOverviewProgressSubscriptionVariables = Exact<{
  course: string;
}>;


export type CourseRepoOverviewProgressSubscription = { courseRepoOverviewProgress: { total: number, done: boolean, error: string | null, assignment: { name: string, per: string, targets: number, existing: number, note: string | null, repos: Array<{ for: string, url: string, exists: boolean }> } | null } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { me: { email: string, name: string } };

export type ServerInfoQueryVariables = Exact<{ [key: string]: never; }>;


export type ServerInfoQuery = { serverInfo: { version: string, commit: string, date: string } };

export type CopyAssignmentMutationVariables = Exact<{
  course: string;
  from: string;
  newName: string;
}>;


export type CopyAssignmentMutation = { copyAssignment: { name: string } };

export type DeleteAssignmentMutationVariables = Exact<{
  course: string;
  name: string;
}>;


export type DeleteAssignmentMutation = { deleteAssignment: boolean };

export type ImportAssignmentYamlMutationVariables = Exact<{
  course: string;
  yaml: string;
}>;


export type ImportAssignmentYamlMutation = { importAssignmentYAML: { name: string } };

export type RenameAssignmentMutationVariables = Exact<{
  course: string;
  oldName: string;
  newName: string;
}>;


export type RenameAssignmentMutation = { renameAssignment: { name: string } };

export type SetAssignmentMutationVariables = Exact<{
  course: string;
  name: string;
  draft: Array<FieldValueInput> | FieldValueInput;
}>;


export type SetAssignmentMutation = { setAssignment: { course: string, name: string, extends: string | null, abstract: boolean, resolved: string, resolveError: string | null, own: Array<{ key: string, value: string }> } };

export type ValidateAssignmentDraftQueryVariables = Exact<{
  course: string;
  name: string;
  draft: Array<FieldValueInput> | FieldValueInput;
}>;


export type ValidateAssignmentDraftQuery = { validateAssignmentDraft: { ok: boolean, errors: Array<string>, resolved: string | null, resolveError: string | null } };

export type CreateCourseMutationVariables = Exact<{
  name: string;
  coursePath: string;
  semesterPath: string;
  useCoursenameAsPrefix: boolean;
  useEmailDomainAsSuffix: boolean;
}>;


export type CreateCourseMutation = { createCourse: { name: string } };

export type DeleteCourseMutationVariables = Exact<{
  name: string;
}>;


export type DeleteCourseMutation = { deleteCourse: boolean };

export type SetCourseGroupsMutationVariables = Exact<{
  name: string;
  groups: Array<GroupInput> | GroupInput;
}>;


export type SetCourseGroupsMutation = { setCourseGroups: { name: string } };

export type ImportCourseYamlMutationVariables = Exact<{
  yaml: string;
}>;


export type ImportCourseYamlMutation = { importCourseYAML: { name: string } };

export type RenameCourseMutationVariables = Exact<{
  oldName: string;
  newName: string;
}>;


export type RenameCourseMutation = { renameCourse: { name: string } };

export type SetCourseMutationVariables = Exact<{
  name: string;
  coursePath: string;
  semesterPath: string;
  useCoursenameAsPrefix: boolean;
  useEmailDomainAsSuffix: boolean;
}>;


export type SetCourseMutation = { setCourse: { name: string } };

export type SetCourseStudentsMutationVariables = Exact<{
  name: string;
  students: Array<string> | string;
}>;


export type SetCourseStudentsMutation = { setCourseStudents: { name: string } };

export type CancelScheduledJobMutationVariables = Exact<{
  id: string | number;
}>;


export type CancelScheduledJobMutation = { cancelScheduledJob: { id: string, status: JobStatus } };

export type PlanOpMutationVariables = Exact<{
  op: Op;
  course: string;
  assignment: string;
  params?: OpParams | null | undefined;
  onlyFor?: Array<string> | string | null | undefined;
}>;


export type PlanOpMutation = { planOp: { op: Op, course: string, assignment: string, resolved: string, warnings: Array<string>, destructive: boolean, confirmPhrase: string | null, token: string, expiresAt: string, targets: Array<{ for: string, repo: string, url: string }> } };

export type ScheduleOpMutationVariables = Exact<{
  token: string;
  runAt: string;
  graceMinutes?: number | null | undefined;
  confirmPhrase?: string | null | undefined;
}>;


export type ScheduleOpMutation = { scheduleOp: { id: string, op: string, course: string, assignment: string, runAt: string, graceMinutes: number, status: JobStatus } };

export type RemoveGitlabTokenMutationVariables = Exact<{ [key: string]: never; }>;


export type RemoveGitlabTokenMutation = { removeGitlabToken: { set: boolean, updatedAt: string | null } };

export type SetGitlabTokenMutationVariables = Exact<{
  token: string;
}>;


export type SetGitlabTokenMutation = { setGitlabToken: { set: boolean, updatedAt: string | null } };

export type CoursesQueryVariables = Exact<{ [key: string]: never; }>;


export type CoursesQuery = { courses: Array<{ name: string, coursePath: string, semesterPath: string, assignmentNames: Array<string>, studentCount: number, groupCount: number, importedAt: string, updatedAt: string }> };

export type CourseQueryVariables = Exact<{
  name: string;
}>;


export type CourseQuery = { course: { name: string, coursePath: string, semesterPath: string, useCoursenameAsPrefix: boolean, useEmailDomainAsSuffix: boolean, students: Array<string>, assignmentNames: Array<string>, studentCount: number, groupCount: number, importedAt: string, updatedAt: string, groups: Array<{ name: string, members: Array<string> }> } | null };

export type CourseLintQueryVariables = Exact<{
  name: string;
}>;


export type CourseLintQuery = { courseLint: Array<{ path: string, message: string, severity: FindingSeverity }> };

export type CourseActivityQueryVariables = Exact<{
  name: string;
}>;


export type CourseActivityQuery = { courseActivity: Array<{ assignment: string, op: string, status: string, detail: string, at: string }> };

export type AssignmentEditorQueryVariables = Exact<{
  course: string;
  name: string;
}>;


export type AssignmentEditorQuery = { course: { assignmentNames: Array<string> } | null, assignmentSchema: Array<{ key: string, label: string, description: string, group: string, kind: FieldKind, required: boolean, deprecated: boolean, example: string | null, options: Array<{ value: string, label: string, description: string }> }>, branchRuleSchema: Array<{ key: string, label: string, description: string, kind: FieldKind, required: boolean, example: string | null }>, approvalSettingsSchema: Array<{ key: string, label: string, description: string, kind: FieldKind, required: boolean, example: string | null, options: Array<{ value: string, label: string, description: string }> }>, approvalRuleSchema: Array<{ key: string, label: string, description: string, kind: FieldKind, required: boolean, example: string | null }>, assignment: { course: string, name: string, extends: string | null, extendsOptions: Array<string>, abstract: boolean, resolved: string, resolveError: string | null, own: Array<{ key: string, value: string }> } | null, assignmentUrls: { per: string, groupUrl: string, repos: Array<{ for: string, url: string }> } | null, assignmentActivity: Array<{ op: string, status: string, detail: string, at: string }> };

export type OpsTargetsQueryVariables = Exact<{
  course: string;
  name: string;
}>;


export type OpsTargetsQuery = { assignmentUrls: { per: string, repos: Array<{ for: string }> } | null };

export type CourseStudentsQueryVariables = Exact<{
  course: string;
}>;


export type CourseStudentsQuery = { courseStudents: Array<{ email: string, found: boolean, firstName: string | null, lastName: string | null, gender: string | null, group: string | null }> };

export type CourseYamlQueryVariables = Exact<{
  name: string;
}>;


export type CourseYamlQuery = { courseYAML: string };

export type ScheduledJobsQueryVariables = Exact<{ [key: string]: never; }>;


export type ScheduledJobsQuery = { scheduledJobs: Array<{ id: string, op: string, course: string, assignment: string, runAt: string, graceMinutes: number, status: JobStatus, createdAt: string, startedAt: string | null, finishedAt: string | null, err: string | null, params: Array<{ key: string, value: string }> }> };

export type GitlabTokenQueryVariables = Exact<{ [key: string]: never; }>;


export type GitlabTokenQuery = { gitlabToken: { set: boolean, updatedAt: string | null } };


export const AuthCheckDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AuthCheck"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<AuthCheckQuery, AuthCheckQueryVariables>;
export const CourseCheckProgressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"CourseCheckProgress"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"courseCheckProgress"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"done"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"result"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"course"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}},{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"students"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"input"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"Field","name":{"kind":"Name","value":"groups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"input"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"duplicates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"student"}},{"kind":"Field","name":{"kind":"Name","value":"groups"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CourseCheckProgressSubscription, CourseCheckProgressSubscriptionVariables>;
export const RunOpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"RunOp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"confirmPhrase"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"runOp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}},{"kind":"Argument","name":{"kind":"Name","value":"confirmPhrase"},"value":{"kind":"Variable","name":{"kind":"Name","value":"confirmPhrase"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}}]}}]} as unknown as DocumentNode<RunOpSubscription, RunOpSubscriptionVariables>;
export const AssignmentReportProgressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"AssignmentReportProgress"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"course"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignmentReportProgress"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"course"},"value":{"kind":"Variable","name":{"kind":"Name","value":"course"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"done"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"report"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"course"}},{"kind":"Field","name":{"kind":"Name","value":"assignment"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"generated"}},{"kind":"Field","name":{"kind":"Name","value":"hasReleaseMergeRequest"}},{"kind":"Field","name":{"kind":"Name","value":"hasReleaseDockerImages"}},{"kind":"Field","name":{"kind":"Name","value":"projects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"emptyRepo"}},{"kind":"Field","name":{"kind":"Name","value":"commits"}},{"kind":"Field","name":{"kind":"Name","value":"lastActivity"}},{"kind":"Field","name":{"kind":"Name","value":"webUrl"}},{"kind":"Field","name":{"kind":"Name","value":"openIssuesCount"}},{"kind":"Field","name":{"kind":"Name","value":"openMergeRequestsCount"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"webUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lastCommit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"committerName"}},{"kind":"Field","name":{"kind":"Name","value":"committedDate"}},{"kind":"Field","name":{"kind":"Name","value":"webUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"release"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mergeRequest"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"found"}},{"kind":"Field","name":{"kind":"Name","value":"webUrl"}},{"kind":"Field","name":{"kind":"Name","value":"pipelineStatus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dockerImages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"wanted"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<AssignmentReportProgressSubscription, AssignmentReportProgressSubscriptionVariables>;
export const CourseRepoOverviewProgressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"CourseRepoOverviewProgress"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"course"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"courseRepoOverviewProgress"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"course"},"value":{"kind":"Variable","name":{"kind":"Name","value":"course"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"done"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"assignment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"per"}},{"kind":"Field","name":{"kind":"Name","value":"targets"}},{"kind":"Field","name":{"kind":"Name","value":"existing"}},{"kind":"Field","name":{"kind":"Name","value":"note"}},{"kind":"Field","name":{"kind":"Name","value":"repos"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"for"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"exists"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CourseRepoOverviewProgressSubscription, CourseRepoOverviewProgressSubscriptionVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const ServerInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ServerInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"serverInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"commit"}},{"kind":"Field","name":{"kind":"Name","value":"date"}}]}}]}}]} as unknown as DocumentNode<ServerInfoQuery, ServerInfoQueryVariables>;
export const CopyAssignmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CopyAssignment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"course"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"copyAssignment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"course"},"value":{"kind":"Variable","name":{"kind":"Name","value":"course"}}},{"kind":"Argument","name":{"kind":"Name","value":"from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"Argument","name":{"kind":"Name","value":"newName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newName"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CopyAssignmentMutation, CopyAssignmentMutationVariables>;
export const DeleteAssignmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteAssignment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"course"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteAssignment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"course"},"value":{"kind":"Variable","name":{"kind":"Name","value":"course"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}]}]}}]} as unknown as DocumentNode<DeleteAssignmentMutation, DeleteAssignmentMutationVariables>;
export const ImportAssignmentYamlDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ImportAssignmentYAML"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"course"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"yaml"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"importAssignmentYAML"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"course"},"value":{"kind":"Variable","name":{"kind":"Name","value":"course"}}},{"kind":"Argument","name":{"kind":"Name","value":"yaml"},"value":{"kind":"Variable","name":{"kind":"Name","value":"yaml"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<ImportAssignmentYamlMutation, ImportAssignmentYamlMutationVariables>;
export const RenameAssignmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RenameAssignment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"course"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"oldName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"renameAssignment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"course"},"value":{"kind":"Variable","name":{"kind":"Name","value":"course"}}},{"kind":"Argument","name":{"kind":"Name","value":"oldName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"oldName"}}},{"kind":"Argument","name":{"kind":"Name","value":"newName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newName"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<RenameAssignmentMutation, RenameAssignmentMutationVariables>;
export const SetAssignmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetAssignment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"course"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"draft"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FieldValueInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setAssignment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"course"},"value":{"kind":"Variable","name":{"kind":"Name","value":"course"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"draft"},"value":{"kind":"Variable","name":{"kind":"Name","value":"draft"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"course"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"extends"}},{"kind":"Field","name":{"kind":"Name","value":"abstract"}},{"kind":"Field","name":{"kind":"Name","value":"own"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"resolved"}},{"kind":"Field","name":{"kind":"Name","value":"resolveError"}}]}}]}}]} as unknown as DocumentNode<SetAssignmentMutation, SetAssignmentMutationVariables>;
export const ValidateAssignmentDraftDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ValidateAssignmentDraft"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"course"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"draft"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FieldValueInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"validateAssignmentDraft"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"course"},"value":{"kind":"Variable","name":{"kind":"Name","value":"course"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"draft"},"value":{"kind":"Variable","name":{"kind":"Name","value":"draft"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}},{"kind":"Field","name":{"kind":"Name","value":"resolved"}},{"kind":"Field","name":{"kind":"Name","value":"resolveError"}}]}}]}}]} as unknown as DocumentNode<ValidateAssignmentDraftQuery, ValidateAssignmentDraftQueryVariables>;
export const CreateCourseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCourse"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"coursePath"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"semesterPath"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"useCoursenameAsPrefix"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"useEmailDomainAsSuffix"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCourse"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"coursePath"},"value":{"kind":"Variable","name":{"kind":"Name","value":"coursePath"}}},{"kind":"Argument","name":{"kind":"Name","value":"semesterPath"},"value":{"kind":"Variable","name":{"kind":"Name","value":"semesterPath"}}},{"kind":"Argument","name":{"kind":"Name","value":"useCoursenameAsPrefix"},"value":{"kind":"Variable","name":{"kind":"Name","value":"useCoursenameAsPrefix"}}},{"kind":"Argument","name":{"kind":"Name","value":"useEmailDomainAsSuffix"},"value":{"kind":"Variable","name":{"kind":"Name","value":"useEmailDomainAsSuffix"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CreateCourseMutation, CreateCourseMutationVariables>;
export const DeleteCourseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteCourse"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCourse"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}]}]}}]} as unknown as DocumentNode<DeleteCourseMutation, DeleteCourseMutationVariables>;
export const SetCourseGroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetCourseGroups"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"groups"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GroupInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setCourseGroups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"groups"},"value":{"kind":"Variable","name":{"kind":"Name","value":"groups"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<SetCourseGroupsMutation, SetCourseGroupsMutationVariables>;
export const ImportCourseYamlDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ImportCourseYAML"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"yaml"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"importCourseYAML"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"yaml"},"value":{"kind":"Variable","name":{"kind":"Name","value":"yaml"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<ImportCourseYamlMutation, ImportCourseYamlMutationVariables>;
export const RenameCourseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RenameCourse"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"oldName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"renameCourse"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"oldName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"oldName"}}},{"kind":"Argument","name":{"kind":"Name","value":"newName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newName"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<RenameCourseMutation, RenameCourseMutationVariables>;
export const SetCourseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetCourse"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"coursePath"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"semesterPath"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"useCoursenameAsPrefix"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"useEmailDomainAsSuffix"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setCourse"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"coursePath"},"value":{"kind":"Variable","name":{"kind":"Name","value":"coursePath"}}},{"kind":"Argument","name":{"kind":"Name","value":"semesterPath"},"value":{"kind":"Variable","name":{"kind":"Name","value":"semesterPath"}}},{"kind":"Argument","name":{"kind":"Name","value":"useCoursenameAsPrefix"},"value":{"kind":"Variable","name":{"kind":"Name","value":"useCoursenameAsPrefix"}}},{"kind":"Argument","name":{"kind":"Name","value":"useEmailDomainAsSuffix"},"value":{"kind":"Variable","name":{"kind":"Name","value":"useEmailDomainAsSuffix"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<SetCourseMutation, SetCourseMutationVariables>;
export const SetCourseStudentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetCourseStudents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"students"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setCourseStudents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"students"},"value":{"kind":"Variable","name":{"kind":"Name","value":"students"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<SetCourseStudentsMutation, SetCourseStudentsMutationVariables>;
export const CancelScheduledJobDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CancelScheduledJob"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cancelScheduledJob"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<CancelScheduledJobMutation, CancelScheduledJobMutationVariables>;
export const PlanOpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PlanOp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"op"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Op"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"course"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"assignment"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"params"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"OpParams"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"onlyFor"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"planOp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"op"},"value":{"kind":"Variable","name":{"kind":"Name","value":"op"}}},{"kind":"Argument","name":{"kind":"Name","value":"course"},"value":{"kind":"Variable","name":{"kind":"Name","value":"course"}}},{"kind":"Argument","name":{"kind":"Name","value":"assignment"},"value":{"kind":"Variable","name":{"kind":"Name","value":"assignment"}}},{"kind":"Argument","name":{"kind":"Name","value":"params"},"value":{"kind":"Variable","name":{"kind":"Name","value":"params"}}},{"kind":"Argument","name":{"kind":"Name","value":"onlyFor"},"value":{"kind":"Variable","name":{"kind":"Name","value":"onlyFor"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"op"}},{"kind":"Field","name":{"kind":"Name","value":"course"}},{"kind":"Field","name":{"kind":"Name","value":"assignment"}},{"kind":"Field","name":{"kind":"Name","value":"resolved"}},{"kind":"Field","name":{"kind":"Name","value":"targets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"for"}},{"kind":"Field","name":{"kind":"Name","value":"repo"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"warnings"}},{"kind":"Field","name":{"kind":"Name","value":"destructive"}},{"kind":"Field","name":{"kind":"Name","value":"confirmPhrase"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}}]}}]}}]} as unknown as DocumentNode<PlanOpMutation, PlanOpMutationVariables>;
export const ScheduleOpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ScheduleOp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"runAt"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Time"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"graceMinutes"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"confirmPhrase"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"scheduleOp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}},{"kind":"Argument","name":{"kind":"Name","value":"runAt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"runAt"}}},{"kind":"Argument","name":{"kind":"Name","value":"graceMinutes"},"value":{"kind":"Variable","name":{"kind":"Name","value":"graceMinutes"}}},{"kind":"Argument","name":{"kind":"Name","value":"confirmPhrase"},"value":{"kind":"Variable","name":{"kind":"Name","value":"confirmPhrase"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"op"}},{"kind":"Field","name":{"kind":"Name","value":"course"}},{"kind":"Field","name":{"kind":"Name","value":"assignment"}},{"kind":"Field","name":{"kind":"Name","value":"runAt"}},{"kind":"Field","name":{"kind":"Name","value":"graceMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<ScheduleOpMutation, ScheduleOpMutationVariables>;
export const RemoveGitlabTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveGitlabToken"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeGitlabToken"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"set"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<RemoveGitlabTokenMutation, RemoveGitlabTokenMutationVariables>;
export const SetGitlabTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetGitlabToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setGitlabToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"set"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<SetGitlabTokenMutation, SetGitlabTokenMutationVariables>;
export const CoursesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Courses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"courses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"coursePath"}},{"kind":"Field","name":{"kind":"Name","value":"semesterPath"}},{"kind":"Field","name":{"kind":"Name","value":"assignmentNames"}},{"kind":"Field","name":{"kind":"Name","value":"studentCount"}},{"kind":"Field","name":{"kind":"Name","value":"groupCount"}},{"kind":"Field","name":{"kind":"Name","value":"importedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CoursesQuery, CoursesQueryVariables>;
export const CourseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Course"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"course"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"coursePath"}},{"kind":"Field","name":{"kind":"Name","value":"semesterPath"}},{"kind":"Field","name":{"kind":"Name","value":"useCoursenameAsPrefix"}},{"kind":"Field","name":{"kind":"Name","value":"useEmailDomainAsSuffix"}},{"kind":"Field","name":{"kind":"Name","value":"students"}},{"kind":"Field","name":{"kind":"Name","value":"groups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"members"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assignmentNames"}},{"kind":"Field","name":{"kind":"Name","value":"studentCount"}},{"kind":"Field","name":{"kind":"Name","value":"groupCount"}},{"kind":"Field","name":{"kind":"Name","value":"importedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CourseQuery, CourseQueryVariables>;
export const CourseLintDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CourseLint"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"courseLint"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"severity"}}]}}]}}]} as unknown as DocumentNode<CourseLintQuery, CourseLintQueryVariables>;
export const CourseActivityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CourseActivity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"courseActivity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"course"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignment"}},{"kind":"Field","name":{"kind":"Name","value":"op"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"detail"}},{"kind":"Field","name":{"kind":"Name","value":"at"}}]}}]}}]} as unknown as DocumentNode<CourseActivityQuery, CourseActivityQueryVariables>;
export const AssignmentEditorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AssignmentEditor"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"course"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"course"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"course"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignmentNames"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assignmentSchema"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"group"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"deprecated"}},{"kind":"Field","name":{"kind":"Name","value":"example"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"branchRuleSchema"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"example"}}]}},{"kind":"Field","name":{"kind":"Name","value":"approvalSettingsSchema"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"example"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"approvalRuleSchema"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"example"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assignment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"course"},"value":{"kind":"Variable","name":{"kind":"Name","value":"course"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"course"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"extends"}},{"kind":"Field","name":{"kind":"Name","value":"extendsOptions"}},{"kind":"Field","name":{"kind":"Name","value":"abstract"}},{"kind":"Field","name":{"kind":"Name","value":"own"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"resolved"}},{"kind":"Field","name":{"kind":"Name","value":"resolveError"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assignmentUrls"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"course"},"value":{"kind":"Variable","name":{"kind":"Name","value":"course"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"per"}},{"kind":"Field","name":{"kind":"Name","value":"groupUrl"}},{"kind":"Field","name":{"kind":"Name","value":"repos"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"for"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"assignmentActivity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"course"},"value":{"kind":"Variable","name":{"kind":"Name","value":"course"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"op"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"detail"}},{"kind":"Field","name":{"kind":"Name","value":"at"}}]}}]}}]} as unknown as DocumentNode<AssignmentEditorQuery, AssignmentEditorQueryVariables>;
export const OpsTargetsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OpsTargets"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"course"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignmentUrls"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"course"},"value":{"kind":"Variable","name":{"kind":"Name","value":"course"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"per"}},{"kind":"Field","name":{"kind":"Name","value":"repos"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"for"}}]}}]}}]}}]} as unknown as DocumentNode<OpsTargetsQuery, OpsTargetsQueryVariables>;
export const CourseStudentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CourseStudents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"course"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"courseStudents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"course"},"value":{"kind":"Variable","name":{"kind":"Name","value":"course"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"found"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"group"}}]}}]}}]} as unknown as DocumentNode<CourseStudentsQuery, CourseStudentsQueryVariables>;
export const CourseYamlDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CourseYAML"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"courseYAML"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}]}]}}]} as unknown as DocumentNode<CourseYamlQuery, CourseYamlQueryVariables>;
export const ScheduledJobsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ScheduledJobs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"scheduledJobs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"op"}},{"kind":"Field","name":{"kind":"Name","value":"course"}},{"kind":"Field","name":{"kind":"Name","value":"assignment"}},{"kind":"Field","name":{"kind":"Name","value":"runAt"}},{"kind":"Field","name":{"kind":"Name","value":"graceMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}},{"kind":"Field","name":{"kind":"Name","value":"finishedAt"}},{"kind":"Field","name":{"kind":"Name","value":"err"}},{"kind":"Field","name":{"kind":"Name","value":"params"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]} as unknown as DocumentNode<ScheduledJobsQuery, ScheduledJobsQueryVariables>;
export const GitlabTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GitlabToken"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gitlabToken"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"set"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GitlabTokenQuery, GitlabTokenQueryVariables>;