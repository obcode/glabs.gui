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

export type AuthCheckQueryVariables = Exact<{ [key: string]: never; }>;


export type AuthCheckQuery = { me: { email: string } };

export type AssignmentReportProgressSubscriptionVariables = Exact<{
  course: string;
  name: string;
}>;


export type AssignmentReportProgressSubscription = { assignmentReportProgress: { message: string, done: boolean, error: string | null, report: { course: string, assignment: string, url: string, description: string, generated: string | null, hasReleaseMergeRequest: boolean, hasReleaseDockerImages: boolean, projects: Array<{ name: string, active: boolean, emptyRepo: boolean, commits: number, lastActivity: string | null, webUrl: string, openIssuesCount: number, openMergeRequestsCount: number, members: Array<{ name: string, username: string, webUrl: string }>, lastCommit: { title: string, committerName: string, committedDate: string | null, webUrl: string } | null, release: { mergeRequest: { found: boolean, webUrl: string, pipelineStatus: string } | null, dockerImages: { status: string, images: Array<{ wanted: string, image: string | null }> } | null } | null }> } | null } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { me: { email: string, name: string } };

export type ServerInfoQueryVariables = Exact<{ [key: string]: never; }>;


export type ServerInfoQuery = { serverInfo: { version: string, commit: string, date: string } };

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

export type AssignmentEditorQueryVariables = Exact<{
  course: string;
  name: string;
}>;


export type AssignmentEditorQuery = { assignmentSchema: Array<{ key: string, label: string, description: string, group: string, kind: FieldKind, required: boolean, deprecated: boolean, example: string | null, options: Array<{ value: string, label: string, description: string }> }>, branchRuleSchema: Array<{ key: string, label: string, description: string, kind: FieldKind, required: boolean, example: string | null }>, approvalSettingsSchema: Array<{ key: string, label: string, description: string, kind: FieldKind, required: boolean, example: string | null, options: Array<{ value: string, label: string, description: string }> }>, approvalRuleSchema: Array<{ key: string, label: string, description: string, kind: FieldKind, required: boolean, example: string | null }>, assignment: { course: string, name: string, extends: string | null, abstract: boolean, resolved: string, resolveError: string | null, own: Array<{ key: string, value: string }> } | null, assignmentUrls: { per: string, groupUrl: string, repos: Array<{ for: string, url: string }> } | null };

export type CourseYamlQueryVariables = Exact<{
  name: string;
}>;


export type CourseYamlQuery = { courseYAML: string };

export type GitlabTokenQueryVariables = Exact<{ [key: string]: never; }>;


export type GitlabTokenQuery = { gitlabToken: { set: boolean, updatedAt: string | null } };


export const AuthCheckDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AuthCheck"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<AuthCheckQuery, AuthCheckQueryVariables>;
export const AssignmentReportProgressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"AssignmentReportProgress"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"course"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignmentReportProgress"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"course"},"value":{"kind":"Variable","name":{"kind":"Name","value":"course"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"done"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"report"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"course"}},{"kind":"Field","name":{"kind":"Name","value":"assignment"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"generated"}},{"kind":"Field","name":{"kind":"Name","value":"hasReleaseMergeRequest"}},{"kind":"Field","name":{"kind":"Name","value":"hasReleaseDockerImages"}},{"kind":"Field","name":{"kind":"Name","value":"projects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"emptyRepo"}},{"kind":"Field","name":{"kind":"Name","value":"commits"}},{"kind":"Field","name":{"kind":"Name","value":"lastActivity"}},{"kind":"Field","name":{"kind":"Name","value":"webUrl"}},{"kind":"Field","name":{"kind":"Name","value":"openIssuesCount"}},{"kind":"Field","name":{"kind":"Name","value":"openMergeRequestsCount"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"webUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lastCommit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"committerName"}},{"kind":"Field","name":{"kind":"Name","value":"committedDate"}},{"kind":"Field","name":{"kind":"Name","value":"webUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"release"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mergeRequest"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"found"}},{"kind":"Field","name":{"kind":"Name","value":"webUrl"}},{"kind":"Field","name":{"kind":"Name","value":"pipelineStatus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dockerImages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"wanted"}},{"kind":"Field","name":{"kind":"Name","value":"image"}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<AssignmentReportProgressSubscription, AssignmentReportProgressSubscriptionVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const ServerInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ServerInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"serverInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"commit"}},{"kind":"Field","name":{"kind":"Name","value":"date"}}]}}]}}]} as unknown as DocumentNode<ServerInfoQuery, ServerInfoQueryVariables>;
export const DeleteAssignmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteAssignment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"course"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteAssignment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"course"},"value":{"kind":"Variable","name":{"kind":"Name","value":"course"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}]}]}}]} as unknown as DocumentNode<DeleteAssignmentMutation, DeleteAssignmentMutationVariables>;
export const ImportAssignmentYamlDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ImportAssignmentYAML"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"course"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"yaml"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"importAssignmentYAML"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"course"},"value":{"kind":"Variable","name":{"kind":"Name","value":"course"}}},{"kind":"Argument","name":{"kind":"Name","value":"yaml"},"value":{"kind":"Variable","name":{"kind":"Name","value":"yaml"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<ImportAssignmentYamlMutation, ImportAssignmentYamlMutationVariables>;
export const SetAssignmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetAssignment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"course"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"draft"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FieldValueInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setAssignment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"course"},"value":{"kind":"Variable","name":{"kind":"Name","value":"course"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"draft"},"value":{"kind":"Variable","name":{"kind":"Name","value":"draft"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"course"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"extends"}},{"kind":"Field","name":{"kind":"Name","value":"abstract"}},{"kind":"Field","name":{"kind":"Name","value":"own"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"resolved"}},{"kind":"Field","name":{"kind":"Name","value":"resolveError"}}]}}]}}]} as unknown as DocumentNode<SetAssignmentMutation, SetAssignmentMutationVariables>;
export const ValidateAssignmentDraftDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ValidateAssignmentDraft"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"course"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"draft"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FieldValueInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"validateAssignmentDraft"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"course"},"value":{"kind":"Variable","name":{"kind":"Name","value":"course"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"draft"},"value":{"kind":"Variable","name":{"kind":"Name","value":"draft"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}},{"kind":"Field","name":{"kind":"Name","value":"resolved"}},{"kind":"Field","name":{"kind":"Name","value":"resolveError"}}]}}]}}]} as unknown as DocumentNode<ValidateAssignmentDraftQuery, ValidateAssignmentDraftQueryVariables>;
export const CreateCourseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCourse"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"coursePath"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"semesterPath"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"useCoursenameAsPrefix"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"useEmailDomainAsSuffix"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCourse"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"coursePath"},"value":{"kind":"Variable","name":{"kind":"Name","value":"coursePath"}}},{"kind":"Argument","name":{"kind":"Name","value":"semesterPath"},"value":{"kind":"Variable","name":{"kind":"Name","value":"semesterPath"}}},{"kind":"Argument","name":{"kind":"Name","value":"useCoursenameAsPrefix"},"value":{"kind":"Variable","name":{"kind":"Name","value":"useCoursenameAsPrefix"}}},{"kind":"Argument","name":{"kind":"Name","value":"useEmailDomainAsSuffix"},"value":{"kind":"Variable","name":{"kind":"Name","value":"useEmailDomainAsSuffix"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CreateCourseMutation, CreateCourseMutationVariables>;
export const DeleteCourseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteCourse"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCourse"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}]}]}}]} as unknown as DocumentNode<DeleteCourseMutation, DeleteCourseMutationVariables>;
export const SetCourseGroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetCourseGroups"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"groups"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GroupInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setCourseGroups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"groups"},"value":{"kind":"Variable","name":{"kind":"Name","value":"groups"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<SetCourseGroupsMutation, SetCourseGroupsMutationVariables>;
export const ImportCourseYamlDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ImportCourseYAML"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"yaml"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"importCourseYAML"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"yaml"},"value":{"kind":"Variable","name":{"kind":"Name","value":"yaml"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<ImportCourseYamlMutation, ImportCourseYamlMutationVariables>;
export const SetCourseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetCourse"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"coursePath"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"semesterPath"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"useCoursenameAsPrefix"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"useEmailDomainAsSuffix"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setCourse"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"coursePath"},"value":{"kind":"Variable","name":{"kind":"Name","value":"coursePath"}}},{"kind":"Argument","name":{"kind":"Name","value":"semesterPath"},"value":{"kind":"Variable","name":{"kind":"Name","value":"semesterPath"}}},{"kind":"Argument","name":{"kind":"Name","value":"useCoursenameAsPrefix"},"value":{"kind":"Variable","name":{"kind":"Name","value":"useCoursenameAsPrefix"}}},{"kind":"Argument","name":{"kind":"Name","value":"useEmailDomainAsSuffix"},"value":{"kind":"Variable","name":{"kind":"Name","value":"useEmailDomainAsSuffix"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<SetCourseMutation, SetCourseMutationVariables>;
export const SetCourseStudentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetCourseStudents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"students"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setCourseStudents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"students"},"value":{"kind":"Variable","name":{"kind":"Name","value":"students"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<SetCourseStudentsMutation, SetCourseStudentsMutationVariables>;
export const RemoveGitlabTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveGitlabToken"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeGitlabToken"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"set"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<RemoveGitlabTokenMutation, RemoveGitlabTokenMutationVariables>;
export const SetGitlabTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetGitlabToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setGitlabToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"set"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<SetGitlabTokenMutation, SetGitlabTokenMutationVariables>;
export const CoursesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Courses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"courses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"coursePath"}},{"kind":"Field","name":{"kind":"Name","value":"semesterPath"}},{"kind":"Field","name":{"kind":"Name","value":"assignmentNames"}},{"kind":"Field","name":{"kind":"Name","value":"studentCount"}},{"kind":"Field","name":{"kind":"Name","value":"groupCount"}},{"kind":"Field","name":{"kind":"Name","value":"importedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CoursesQuery, CoursesQueryVariables>;
export const CourseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Course"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"course"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"coursePath"}},{"kind":"Field","name":{"kind":"Name","value":"semesterPath"}},{"kind":"Field","name":{"kind":"Name","value":"useCoursenameAsPrefix"}},{"kind":"Field","name":{"kind":"Name","value":"useEmailDomainAsSuffix"}},{"kind":"Field","name":{"kind":"Name","value":"students"}},{"kind":"Field","name":{"kind":"Name","value":"groups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"members"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assignmentNames"}},{"kind":"Field","name":{"kind":"Name","value":"studentCount"}},{"kind":"Field","name":{"kind":"Name","value":"groupCount"}},{"kind":"Field","name":{"kind":"Name","value":"importedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CourseQuery, CourseQueryVariables>;
export const CourseLintDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CourseLint"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"courseLint"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"severity"}}]}}]}}]} as unknown as DocumentNode<CourseLintQuery, CourseLintQueryVariables>;
export const AssignmentEditorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AssignmentEditor"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"course"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignmentSchema"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"group"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"deprecated"}},{"kind":"Field","name":{"kind":"Name","value":"example"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"branchRuleSchema"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"example"}}]}},{"kind":"Field","name":{"kind":"Name","value":"approvalSettingsSchema"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"example"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"approvalRuleSchema"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"example"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assignment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"course"},"value":{"kind":"Variable","name":{"kind":"Name","value":"course"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"course"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"extends"}},{"kind":"Field","name":{"kind":"Name","value":"abstract"}},{"kind":"Field","name":{"kind":"Name","value":"own"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"resolved"}},{"kind":"Field","name":{"kind":"Name","value":"resolveError"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assignmentUrls"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"course"},"value":{"kind":"Variable","name":{"kind":"Name","value":"course"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"per"}},{"kind":"Field","name":{"kind":"Name","value":"groupUrl"}},{"kind":"Field","name":{"kind":"Name","value":"repos"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"for"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]} as unknown as DocumentNode<AssignmentEditorQuery, AssignmentEditorQueryVariables>;
export const CourseYamlDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CourseYAML"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"courseYAML"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}]}]}}]} as unknown as DocumentNode<CourseYamlQuery, CourseYamlQueryVariables>;
export const GitlabTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GitlabToken"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gitlabToken"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"set"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GitlabTokenQuery, GitlabTokenQueryVariables>;