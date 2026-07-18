/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n\t\t\t\tquery AuthCheck {\n\t\t\t\t\tme {\n\t\t\t\t\t\temail\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t": typeof types.AuthCheckDocument,
    "\n\t\t\t\tquery Me {\n\t\t\t\t\tme {\n\t\t\t\t\t\temail\n\t\t\t\t\t\tname\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t": typeof types.MeDocument,
    "\n\t\t\t\tquery ServerInfo {\n\t\t\t\t\tserverInfo {\n\t\t\t\t\t\tversion\n\t\t\t\t\t\tcommit\n\t\t\t\t\t\tdate\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t": typeof types.ServerInfoDocument,
    "\n\t\t\tmutation DeleteAssignment($course: String!, $name: String!) {\n\t\t\t\tdeleteAssignment(course: $course, name: $name)\n\t\t\t}\n\t\t": typeof types.DeleteAssignmentDocument,
    "\n\t\t\tmutation SetAssignment($course: String!, $name: String!, $draft: [FieldValueInput!]!) {\n\t\t\t\tsetAssignment(course: $course, name: $name, draft: $draft) {\n\t\t\t\t\tcourse\n\t\t\t\t\tname\n\t\t\t\t\textends\n\t\t\t\t\tabstract\n\t\t\t\t\town {\n\t\t\t\t\t\tkey\n\t\t\t\t\t\tvalue\n\t\t\t\t\t}\n\t\t\t\t\tresolved\n\t\t\t\t\tresolveError\n\t\t\t\t}\n\t\t\t}\n\t\t": typeof types.SetAssignmentDocument,
    "\n\t\t\tquery ValidateAssignmentDraft($course: String!, $name: String!, $draft: [FieldValueInput!]!) {\n\t\t\t\tvalidateAssignmentDraft(course: $course, name: $name, draft: $draft) {\n\t\t\t\t\tok\n\t\t\t\t\terrors\n\t\t\t\t\tresolved\n\t\t\t\t\tresolveError\n\t\t\t\t}\n\t\t\t}\n\t\t": typeof types.ValidateAssignmentDraftDocument,
    "\n\t\t\tmutation CreateCourse(\n\t\t\t\t$name: String!\n\t\t\t\t$coursePath: String!\n\t\t\t\t$semesterPath: String!\n\t\t\t\t$useCoursenameAsPrefix: Boolean!\n\t\t\t\t$useEmailDomainAsSuffix: Boolean!\n\t\t\t) {\n\t\t\t\tcreateCourse(\n\t\t\t\t\tname: $name\n\t\t\t\t\tcoursePath: $coursePath\n\t\t\t\t\tsemesterPath: $semesterPath\n\t\t\t\t\tuseCoursenameAsPrefix: $useCoursenameAsPrefix\n\t\t\t\t\tuseEmailDomainAsSuffix: $useEmailDomainAsSuffix\n\t\t\t\t) {\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t}\n\t\t": typeof types.CreateCourseDocument,
    "\n\t\t\tmutation DeleteCourse($name: String!) {\n\t\t\t\tdeleteCourse(name: $name)\n\t\t\t}\n\t\t": typeof types.DeleteCourseDocument,
    "\n\t\t\tmutation SetCourseGroups($name: String!, $groups: [GroupInput!]!) {\n\t\t\t\tsetCourseGroups(name: $name, groups: $groups) {\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t}\n\t\t": typeof types.SetCourseGroupsDocument,
    "\n\t\t\tmutation ImportCourseYAML($yaml: String!) {\n\t\t\t\timportCourseYAML(yaml: $yaml) {\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t}\n\t\t": typeof types.ImportCourseYamlDocument,
    "\n\t\t\tmutation SetCourse(\n\t\t\t\t$name: String!\n\t\t\t\t$coursePath: String!\n\t\t\t\t$semesterPath: String!\n\t\t\t\t$useCoursenameAsPrefix: Boolean!\n\t\t\t\t$useEmailDomainAsSuffix: Boolean!\n\t\t\t) {\n\t\t\t\tsetCourse(\n\t\t\t\t\tname: $name\n\t\t\t\t\tcoursePath: $coursePath\n\t\t\t\t\tsemesterPath: $semesterPath\n\t\t\t\t\tuseCoursenameAsPrefix: $useCoursenameAsPrefix\n\t\t\t\t\tuseEmailDomainAsSuffix: $useEmailDomainAsSuffix\n\t\t\t\t) {\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t}\n\t\t": typeof types.SetCourseDocument,
    "\n\t\t\tmutation SetCourseStudents($name: String!, $students: [String!]!) {\n\t\t\t\tsetCourseStudents(name: $name, students: $students) {\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t}\n\t\t": typeof types.SetCourseStudentsDocument,
    "\n\t\t\tmutation RemoveGitlabToken {\n\t\t\t\tremoveGitlabToken {\n\t\t\t\t\tset\n\t\t\t\t\tupdatedAt\n\t\t\t\t}\n\t\t\t}\n\t\t": typeof types.RemoveGitlabTokenDocument,
    "\n\t\t\tmutation SetGitlabToken($token: String!) {\n\t\t\t\tsetGitlabToken(token: $token) {\n\t\t\t\t\tset\n\t\t\t\t\tupdatedAt\n\t\t\t\t}\n\t\t\t}\n\t\t": typeof types.SetGitlabTokenDocument,
    "\n\t\t\t\tquery Courses {\n\t\t\t\t\tcourses {\n\t\t\t\t\t\tname\n\t\t\t\t\t\tcoursePath\n\t\t\t\t\t\tsemesterPath\n\t\t\t\t\t\tassignmentNames\n\t\t\t\t\t\tstudentCount\n\t\t\t\t\t\tgroupCount\n\t\t\t\t\t\timportedAt\n\t\t\t\t\t\tupdatedAt\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t": typeof types.CoursesDocument,
    "\n\t\t\t\tquery Course($name: String!) {\n\t\t\t\t\tcourse(name: $name) {\n\t\t\t\t\t\tname\n\t\t\t\t\t\tcoursePath\n\t\t\t\t\t\tsemesterPath\n\t\t\t\t\t\tuseCoursenameAsPrefix\n\t\t\t\t\t\tuseEmailDomainAsSuffix\n\t\t\t\t\t\tstudents\n\t\t\t\t\t\tgroups {\n\t\t\t\t\t\t\tname\n\t\t\t\t\t\t\tmembers\n\t\t\t\t\t\t}\n\t\t\t\t\t\tassignmentNames\n\t\t\t\t\t\tstudentCount\n\t\t\t\t\t\tgroupCount\n\t\t\t\t\t\timportedAt\n\t\t\t\t\t\tupdatedAt\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t": typeof types.CourseDocument,
    "\n\t\t\t\tquery CourseLint($name: String!) {\n\t\t\t\t\tcourseLint(name: $name) {\n\t\t\t\t\t\tpath\n\t\t\t\t\t\tmessage\n\t\t\t\t\t\tseverity\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t": typeof types.CourseLintDocument,
    "\n\t\t\t\tquery AssignmentEditor($course: String!, $name: String!) {\n\t\t\t\t\tassignmentSchema {\n\t\t\t\t\t\tkey\n\t\t\t\t\t\tlabel\n\t\t\t\t\t\tdescription\n\t\t\t\t\t\tgroup\n\t\t\t\t\t\tkind\n\t\t\t\t\t\trequired\n\t\t\t\t\t\tdeprecated\n\t\t\t\t\t\texample\n\t\t\t\t\t\toptions {\n\t\t\t\t\t\t\tvalue\n\t\t\t\t\t\t\tlabel\n\t\t\t\t\t\t\tdescription\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t\tbranchRuleSchema {\n\t\t\t\t\t\tkey\n\t\t\t\t\t\tlabel\n\t\t\t\t\t\tdescription\n\t\t\t\t\t\tkind\n\t\t\t\t\t\trequired\n\t\t\t\t\t\texample\n\t\t\t\t\t}\n\t\t\t\t\tapprovalSettingsSchema {\n\t\t\t\t\t\tkey\n\t\t\t\t\t\tlabel\n\t\t\t\t\t\tdescription\n\t\t\t\t\t\tkind\n\t\t\t\t\t\trequired\n\t\t\t\t\t\texample\n\t\t\t\t\t\toptions {\n\t\t\t\t\t\t\tvalue\n\t\t\t\t\t\t\tlabel\n\t\t\t\t\t\t\tdescription\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t\tapprovalRuleSchema {\n\t\t\t\t\t\tkey\n\t\t\t\t\t\tlabel\n\t\t\t\t\t\tdescription\n\t\t\t\t\t\tkind\n\t\t\t\t\t\trequired\n\t\t\t\t\t\texample\n\t\t\t\t\t}\n\t\t\t\t\tassignment(course: $course, name: $name) {\n\t\t\t\t\t\tcourse\n\t\t\t\t\t\tname\n\t\t\t\t\t\textends\n\t\t\t\t\t\tabstract\n\t\t\t\t\t\town {\n\t\t\t\t\t\t\tkey\n\t\t\t\t\t\t\tvalue\n\t\t\t\t\t\t}\n\t\t\t\t\t\tresolved\n\t\t\t\t\t\tresolveError\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t": typeof types.AssignmentEditorDocument,
    "\n\t\t\t\tquery CourseYAML($name: String!) {\n\t\t\t\t\tcourseYAML(name: $name)\n\t\t\t\t}\n\t\t\t": typeof types.CourseYamlDocument,
    "\n\t\t\t\tquery GitlabToken {\n\t\t\t\t\tgitlabToken {\n\t\t\t\t\t\tset\n\t\t\t\t\t\tupdatedAt\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t": typeof types.GitlabTokenDocument,
};
const documents: Documents = {
    "\n\t\t\t\tquery AuthCheck {\n\t\t\t\t\tme {\n\t\t\t\t\t\temail\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t": types.AuthCheckDocument,
    "\n\t\t\t\tquery Me {\n\t\t\t\t\tme {\n\t\t\t\t\t\temail\n\t\t\t\t\t\tname\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t": types.MeDocument,
    "\n\t\t\t\tquery ServerInfo {\n\t\t\t\t\tserverInfo {\n\t\t\t\t\t\tversion\n\t\t\t\t\t\tcommit\n\t\t\t\t\t\tdate\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t": types.ServerInfoDocument,
    "\n\t\t\tmutation DeleteAssignment($course: String!, $name: String!) {\n\t\t\t\tdeleteAssignment(course: $course, name: $name)\n\t\t\t}\n\t\t": types.DeleteAssignmentDocument,
    "\n\t\t\tmutation SetAssignment($course: String!, $name: String!, $draft: [FieldValueInput!]!) {\n\t\t\t\tsetAssignment(course: $course, name: $name, draft: $draft) {\n\t\t\t\t\tcourse\n\t\t\t\t\tname\n\t\t\t\t\textends\n\t\t\t\t\tabstract\n\t\t\t\t\town {\n\t\t\t\t\t\tkey\n\t\t\t\t\t\tvalue\n\t\t\t\t\t}\n\t\t\t\t\tresolved\n\t\t\t\t\tresolveError\n\t\t\t\t}\n\t\t\t}\n\t\t": types.SetAssignmentDocument,
    "\n\t\t\tquery ValidateAssignmentDraft($course: String!, $name: String!, $draft: [FieldValueInput!]!) {\n\t\t\t\tvalidateAssignmentDraft(course: $course, name: $name, draft: $draft) {\n\t\t\t\t\tok\n\t\t\t\t\terrors\n\t\t\t\t\tresolved\n\t\t\t\t\tresolveError\n\t\t\t\t}\n\t\t\t}\n\t\t": types.ValidateAssignmentDraftDocument,
    "\n\t\t\tmutation CreateCourse(\n\t\t\t\t$name: String!\n\t\t\t\t$coursePath: String!\n\t\t\t\t$semesterPath: String!\n\t\t\t\t$useCoursenameAsPrefix: Boolean!\n\t\t\t\t$useEmailDomainAsSuffix: Boolean!\n\t\t\t) {\n\t\t\t\tcreateCourse(\n\t\t\t\t\tname: $name\n\t\t\t\t\tcoursePath: $coursePath\n\t\t\t\t\tsemesterPath: $semesterPath\n\t\t\t\t\tuseCoursenameAsPrefix: $useCoursenameAsPrefix\n\t\t\t\t\tuseEmailDomainAsSuffix: $useEmailDomainAsSuffix\n\t\t\t\t) {\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t}\n\t\t": types.CreateCourseDocument,
    "\n\t\t\tmutation DeleteCourse($name: String!) {\n\t\t\t\tdeleteCourse(name: $name)\n\t\t\t}\n\t\t": types.DeleteCourseDocument,
    "\n\t\t\tmutation SetCourseGroups($name: String!, $groups: [GroupInput!]!) {\n\t\t\t\tsetCourseGroups(name: $name, groups: $groups) {\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t}\n\t\t": types.SetCourseGroupsDocument,
    "\n\t\t\tmutation ImportCourseYAML($yaml: String!) {\n\t\t\t\timportCourseYAML(yaml: $yaml) {\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t}\n\t\t": types.ImportCourseYamlDocument,
    "\n\t\t\tmutation SetCourse(\n\t\t\t\t$name: String!\n\t\t\t\t$coursePath: String!\n\t\t\t\t$semesterPath: String!\n\t\t\t\t$useCoursenameAsPrefix: Boolean!\n\t\t\t\t$useEmailDomainAsSuffix: Boolean!\n\t\t\t) {\n\t\t\t\tsetCourse(\n\t\t\t\t\tname: $name\n\t\t\t\t\tcoursePath: $coursePath\n\t\t\t\t\tsemesterPath: $semesterPath\n\t\t\t\t\tuseCoursenameAsPrefix: $useCoursenameAsPrefix\n\t\t\t\t\tuseEmailDomainAsSuffix: $useEmailDomainAsSuffix\n\t\t\t\t) {\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t}\n\t\t": types.SetCourseDocument,
    "\n\t\t\tmutation SetCourseStudents($name: String!, $students: [String!]!) {\n\t\t\t\tsetCourseStudents(name: $name, students: $students) {\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t}\n\t\t": types.SetCourseStudentsDocument,
    "\n\t\t\tmutation RemoveGitlabToken {\n\t\t\t\tremoveGitlabToken {\n\t\t\t\t\tset\n\t\t\t\t\tupdatedAt\n\t\t\t\t}\n\t\t\t}\n\t\t": types.RemoveGitlabTokenDocument,
    "\n\t\t\tmutation SetGitlabToken($token: String!) {\n\t\t\t\tsetGitlabToken(token: $token) {\n\t\t\t\t\tset\n\t\t\t\t\tupdatedAt\n\t\t\t\t}\n\t\t\t}\n\t\t": types.SetGitlabTokenDocument,
    "\n\t\t\t\tquery Courses {\n\t\t\t\t\tcourses {\n\t\t\t\t\t\tname\n\t\t\t\t\t\tcoursePath\n\t\t\t\t\t\tsemesterPath\n\t\t\t\t\t\tassignmentNames\n\t\t\t\t\t\tstudentCount\n\t\t\t\t\t\tgroupCount\n\t\t\t\t\t\timportedAt\n\t\t\t\t\t\tupdatedAt\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t": types.CoursesDocument,
    "\n\t\t\t\tquery Course($name: String!) {\n\t\t\t\t\tcourse(name: $name) {\n\t\t\t\t\t\tname\n\t\t\t\t\t\tcoursePath\n\t\t\t\t\t\tsemesterPath\n\t\t\t\t\t\tuseCoursenameAsPrefix\n\t\t\t\t\t\tuseEmailDomainAsSuffix\n\t\t\t\t\t\tstudents\n\t\t\t\t\t\tgroups {\n\t\t\t\t\t\t\tname\n\t\t\t\t\t\t\tmembers\n\t\t\t\t\t\t}\n\t\t\t\t\t\tassignmentNames\n\t\t\t\t\t\tstudentCount\n\t\t\t\t\t\tgroupCount\n\t\t\t\t\t\timportedAt\n\t\t\t\t\t\tupdatedAt\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t": types.CourseDocument,
    "\n\t\t\t\tquery CourseLint($name: String!) {\n\t\t\t\t\tcourseLint(name: $name) {\n\t\t\t\t\t\tpath\n\t\t\t\t\t\tmessage\n\t\t\t\t\t\tseverity\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t": types.CourseLintDocument,
    "\n\t\t\t\tquery AssignmentEditor($course: String!, $name: String!) {\n\t\t\t\t\tassignmentSchema {\n\t\t\t\t\t\tkey\n\t\t\t\t\t\tlabel\n\t\t\t\t\t\tdescription\n\t\t\t\t\t\tgroup\n\t\t\t\t\t\tkind\n\t\t\t\t\t\trequired\n\t\t\t\t\t\tdeprecated\n\t\t\t\t\t\texample\n\t\t\t\t\t\toptions {\n\t\t\t\t\t\t\tvalue\n\t\t\t\t\t\t\tlabel\n\t\t\t\t\t\t\tdescription\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t\tbranchRuleSchema {\n\t\t\t\t\t\tkey\n\t\t\t\t\t\tlabel\n\t\t\t\t\t\tdescription\n\t\t\t\t\t\tkind\n\t\t\t\t\t\trequired\n\t\t\t\t\t\texample\n\t\t\t\t\t}\n\t\t\t\t\tapprovalSettingsSchema {\n\t\t\t\t\t\tkey\n\t\t\t\t\t\tlabel\n\t\t\t\t\t\tdescription\n\t\t\t\t\t\tkind\n\t\t\t\t\t\trequired\n\t\t\t\t\t\texample\n\t\t\t\t\t\toptions {\n\t\t\t\t\t\t\tvalue\n\t\t\t\t\t\t\tlabel\n\t\t\t\t\t\t\tdescription\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t\tapprovalRuleSchema {\n\t\t\t\t\t\tkey\n\t\t\t\t\t\tlabel\n\t\t\t\t\t\tdescription\n\t\t\t\t\t\tkind\n\t\t\t\t\t\trequired\n\t\t\t\t\t\texample\n\t\t\t\t\t}\n\t\t\t\t\tassignment(course: $course, name: $name) {\n\t\t\t\t\t\tcourse\n\t\t\t\t\t\tname\n\t\t\t\t\t\textends\n\t\t\t\t\t\tabstract\n\t\t\t\t\t\town {\n\t\t\t\t\t\t\tkey\n\t\t\t\t\t\t\tvalue\n\t\t\t\t\t\t}\n\t\t\t\t\t\tresolved\n\t\t\t\t\t\tresolveError\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t": types.AssignmentEditorDocument,
    "\n\t\t\t\tquery CourseYAML($name: String!) {\n\t\t\t\t\tcourseYAML(name: $name)\n\t\t\t\t}\n\t\t\t": types.CourseYamlDocument,
    "\n\t\t\t\tquery GitlabToken {\n\t\t\t\t\tgitlabToken {\n\t\t\t\t\t\tset\n\t\t\t\t\t\tupdatedAt\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t": types.GitlabTokenDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\t\t\tquery AuthCheck {\n\t\t\t\t\tme {\n\t\t\t\t\t\temail\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t"): (typeof documents)["\n\t\t\t\tquery AuthCheck {\n\t\t\t\t\tme {\n\t\t\t\t\t\temail\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\t\t\tquery Me {\n\t\t\t\t\tme {\n\t\t\t\t\t\temail\n\t\t\t\t\t\tname\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t"): (typeof documents)["\n\t\t\t\tquery Me {\n\t\t\t\t\tme {\n\t\t\t\t\t\temail\n\t\t\t\t\t\tname\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\t\t\tquery ServerInfo {\n\t\t\t\t\tserverInfo {\n\t\t\t\t\t\tversion\n\t\t\t\t\t\tcommit\n\t\t\t\t\t\tdate\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t"): (typeof documents)["\n\t\t\t\tquery ServerInfo {\n\t\t\t\t\tserverInfo {\n\t\t\t\t\t\tversion\n\t\t\t\t\t\tcommit\n\t\t\t\t\t\tdate\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\t\tmutation DeleteAssignment($course: String!, $name: String!) {\n\t\t\t\tdeleteAssignment(course: $course, name: $name)\n\t\t\t}\n\t\t"): (typeof documents)["\n\t\t\tmutation DeleteAssignment($course: String!, $name: String!) {\n\t\t\t\tdeleteAssignment(course: $course, name: $name)\n\t\t\t}\n\t\t"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\t\tmutation SetAssignment($course: String!, $name: String!, $draft: [FieldValueInput!]!) {\n\t\t\t\tsetAssignment(course: $course, name: $name, draft: $draft) {\n\t\t\t\t\tcourse\n\t\t\t\t\tname\n\t\t\t\t\textends\n\t\t\t\t\tabstract\n\t\t\t\t\town {\n\t\t\t\t\t\tkey\n\t\t\t\t\t\tvalue\n\t\t\t\t\t}\n\t\t\t\t\tresolved\n\t\t\t\t\tresolveError\n\t\t\t\t}\n\t\t\t}\n\t\t"): (typeof documents)["\n\t\t\tmutation SetAssignment($course: String!, $name: String!, $draft: [FieldValueInput!]!) {\n\t\t\t\tsetAssignment(course: $course, name: $name, draft: $draft) {\n\t\t\t\t\tcourse\n\t\t\t\t\tname\n\t\t\t\t\textends\n\t\t\t\t\tabstract\n\t\t\t\t\town {\n\t\t\t\t\t\tkey\n\t\t\t\t\t\tvalue\n\t\t\t\t\t}\n\t\t\t\t\tresolved\n\t\t\t\t\tresolveError\n\t\t\t\t}\n\t\t\t}\n\t\t"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\t\tquery ValidateAssignmentDraft($course: String!, $name: String!, $draft: [FieldValueInput!]!) {\n\t\t\t\tvalidateAssignmentDraft(course: $course, name: $name, draft: $draft) {\n\t\t\t\t\tok\n\t\t\t\t\terrors\n\t\t\t\t\tresolved\n\t\t\t\t\tresolveError\n\t\t\t\t}\n\t\t\t}\n\t\t"): (typeof documents)["\n\t\t\tquery ValidateAssignmentDraft($course: String!, $name: String!, $draft: [FieldValueInput!]!) {\n\t\t\t\tvalidateAssignmentDraft(course: $course, name: $name, draft: $draft) {\n\t\t\t\t\tok\n\t\t\t\t\terrors\n\t\t\t\t\tresolved\n\t\t\t\t\tresolveError\n\t\t\t\t}\n\t\t\t}\n\t\t"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\t\tmutation CreateCourse(\n\t\t\t\t$name: String!\n\t\t\t\t$coursePath: String!\n\t\t\t\t$semesterPath: String!\n\t\t\t\t$useCoursenameAsPrefix: Boolean!\n\t\t\t\t$useEmailDomainAsSuffix: Boolean!\n\t\t\t) {\n\t\t\t\tcreateCourse(\n\t\t\t\t\tname: $name\n\t\t\t\t\tcoursePath: $coursePath\n\t\t\t\t\tsemesterPath: $semesterPath\n\t\t\t\t\tuseCoursenameAsPrefix: $useCoursenameAsPrefix\n\t\t\t\t\tuseEmailDomainAsSuffix: $useEmailDomainAsSuffix\n\t\t\t\t) {\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t}\n\t\t"): (typeof documents)["\n\t\t\tmutation CreateCourse(\n\t\t\t\t$name: String!\n\t\t\t\t$coursePath: String!\n\t\t\t\t$semesterPath: String!\n\t\t\t\t$useCoursenameAsPrefix: Boolean!\n\t\t\t\t$useEmailDomainAsSuffix: Boolean!\n\t\t\t) {\n\t\t\t\tcreateCourse(\n\t\t\t\t\tname: $name\n\t\t\t\t\tcoursePath: $coursePath\n\t\t\t\t\tsemesterPath: $semesterPath\n\t\t\t\t\tuseCoursenameAsPrefix: $useCoursenameAsPrefix\n\t\t\t\t\tuseEmailDomainAsSuffix: $useEmailDomainAsSuffix\n\t\t\t\t) {\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t}\n\t\t"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\t\tmutation DeleteCourse($name: String!) {\n\t\t\t\tdeleteCourse(name: $name)\n\t\t\t}\n\t\t"): (typeof documents)["\n\t\t\tmutation DeleteCourse($name: String!) {\n\t\t\t\tdeleteCourse(name: $name)\n\t\t\t}\n\t\t"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\t\tmutation SetCourseGroups($name: String!, $groups: [GroupInput!]!) {\n\t\t\t\tsetCourseGroups(name: $name, groups: $groups) {\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t}\n\t\t"): (typeof documents)["\n\t\t\tmutation SetCourseGroups($name: String!, $groups: [GroupInput!]!) {\n\t\t\t\tsetCourseGroups(name: $name, groups: $groups) {\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t}\n\t\t"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\t\tmutation ImportCourseYAML($yaml: String!) {\n\t\t\t\timportCourseYAML(yaml: $yaml) {\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t}\n\t\t"): (typeof documents)["\n\t\t\tmutation ImportCourseYAML($yaml: String!) {\n\t\t\t\timportCourseYAML(yaml: $yaml) {\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t}\n\t\t"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\t\tmutation SetCourse(\n\t\t\t\t$name: String!\n\t\t\t\t$coursePath: String!\n\t\t\t\t$semesterPath: String!\n\t\t\t\t$useCoursenameAsPrefix: Boolean!\n\t\t\t\t$useEmailDomainAsSuffix: Boolean!\n\t\t\t) {\n\t\t\t\tsetCourse(\n\t\t\t\t\tname: $name\n\t\t\t\t\tcoursePath: $coursePath\n\t\t\t\t\tsemesterPath: $semesterPath\n\t\t\t\t\tuseCoursenameAsPrefix: $useCoursenameAsPrefix\n\t\t\t\t\tuseEmailDomainAsSuffix: $useEmailDomainAsSuffix\n\t\t\t\t) {\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t}\n\t\t"): (typeof documents)["\n\t\t\tmutation SetCourse(\n\t\t\t\t$name: String!\n\t\t\t\t$coursePath: String!\n\t\t\t\t$semesterPath: String!\n\t\t\t\t$useCoursenameAsPrefix: Boolean!\n\t\t\t\t$useEmailDomainAsSuffix: Boolean!\n\t\t\t) {\n\t\t\t\tsetCourse(\n\t\t\t\t\tname: $name\n\t\t\t\t\tcoursePath: $coursePath\n\t\t\t\t\tsemesterPath: $semesterPath\n\t\t\t\t\tuseCoursenameAsPrefix: $useCoursenameAsPrefix\n\t\t\t\t\tuseEmailDomainAsSuffix: $useEmailDomainAsSuffix\n\t\t\t\t) {\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t}\n\t\t"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\t\tmutation SetCourseStudents($name: String!, $students: [String!]!) {\n\t\t\t\tsetCourseStudents(name: $name, students: $students) {\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t}\n\t\t"): (typeof documents)["\n\t\t\tmutation SetCourseStudents($name: String!, $students: [String!]!) {\n\t\t\t\tsetCourseStudents(name: $name, students: $students) {\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t}\n\t\t"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\t\tmutation RemoveGitlabToken {\n\t\t\t\tremoveGitlabToken {\n\t\t\t\t\tset\n\t\t\t\t\tupdatedAt\n\t\t\t\t}\n\t\t\t}\n\t\t"): (typeof documents)["\n\t\t\tmutation RemoveGitlabToken {\n\t\t\t\tremoveGitlabToken {\n\t\t\t\t\tset\n\t\t\t\t\tupdatedAt\n\t\t\t\t}\n\t\t\t}\n\t\t"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\t\tmutation SetGitlabToken($token: String!) {\n\t\t\t\tsetGitlabToken(token: $token) {\n\t\t\t\t\tset\n\t\t\t\t\tupdatedAt\n\t\t\t\t}\n\t\t\t}\n\t\t"): (typeof documents)["\n\t\t\tmutation SetGitlabToken($token: String!) {\n\t\t\t\tsetGitlabToken(token: $token) {\n\t\t\t\t\tset\n\t\t\t\t\tupdatedAt\n\t\t\t\t}\n\t\t\t}\n\t\t"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\t\t\tquery Courses {\n\t\t\t\t\tcourses {\n\t\t\t\t\t\tname\n\t\t\t\t\t\tcoursePath\n\t\t\t\t\t\tsemesterPath\n\t\t\t\t\t\tassignmentNames\n\t\t\t\t\t\tstudentCount\n\t\t\t\t\t\tgroupCount\n\t\t\t\t\t\timportedAt\n\t\t\t\t\t\tupdatedAt\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t"): (typeof documents)["\n\t\t\t\tquery Courses {\n\t\t\t\t\tcourses {\n\t\t\t\t\t\tname\n\t\t\t\t\t\tcoursePath\n\t\t\t\t\t\tsemesterPath\n\t\t\t\t\t\tassignmentNames\n\t\t\t\t\t\tstudentCount\n\t\t\t\t\t\tgroupCount\n\t\t\t\t\t\timportedAt\n\t\t\t\t\t\tupdatedAt\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\t\t\tquery Course($name: String!) {\n\t\t\t\t\tcourse(name: $name) {\n\t\t\t\t\t\tname\n\t\t\t\t\t\tcoursePath\n\t\t\t\t\t\tsemesterPath\n\t\t\t\t\t\tuseCoursenameAsPrefix\n\t\t\t\t\t\tuseEmailDomainAsSuffix\n\t\t\t\t\t\tstudents\n\t\t\t\t\t\tgroups {\n\t\t\t\t\t\t\tname\n\t\t\t\t\t\t\tmembers\n\t\t\t\t\t\t}\n\t\t\t\t\t\tassignmentNames\n\t\t\t\t\t\tstudentCount\n\t\t\t\t\t\tgroupCount\n\t\t\t\t\t\timportedAt\n\t\t\t\t\t\tupdatedAt\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t"): (typeof documents)["\n\t\t\t\tquery Course($name: String!) {\n\t\t\t\t\tcourse(name: $name) {\n\t\t\t\t\t\tname\n\t\t\t\t\t\tcoursePath\n\t\t\t\t\t\tsemesterPath\n\t\t\t\t\t\tuseCoursenameAsPrefix\n\t\t\t\t\t\tuseEmailDomainAsSuffix\n\t\t\t\t\t\tstudents\n\t\t\t\t\t\tgroups {\n\t\t\t\t\t\t\tname\n\t\t\t\t\t\t\tmembers\n\t\t\t\t\t\t}\n\t\t\t\t\t\tassignmentNames\n\t\t\t\t\t\tstudentCount\n\t\t\t\t\t\tgroupCount\n\t\t\t\t\t\timportedAt\n\t\t\t\t\t\tupdatedAt\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\t\t\tquery CourseLint($name: String!) {\n\t\t\t\t\tcourseLint(name: $name) {\n\t\t\t\t\t\tpath\n\t\t\t\t\t\tmessage\n\t\t\t\t\t\tseverity\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t"): (typeof documents)["\n\t\t\t\tquery CourseLint($name: String!) {\n\t\t\t\t\tcourseLint(name: $name) {\n\t\t\t\t\t\tpath\n\t\t\t\t\t\tmessage\n\t\t\t\t\t\tseverity\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\t\t\tquery AssignmentEditor($course: String!, $name: String!) {\n\t\t\t\t\tassignmentSchema {\n\t\t\t\t\t\tkey\n\t\t\t\t\t\tlabel\n\t\t\t\t\t\tdescription\n\t\t\t\t\t\tgroup\n\t\t\t\t\t\tkind\n\t\t\t\t\t\trequired\n\t\t\t\t\t\tdeprecated\n\t\t\t\t\t\texample\n\t\t\t\t\t\toptions {\n\t\t\t\t\t\t\tvalue\n\t\t\t\t\t\t\tlabel\n\t\t\t\t\t\t\tdescription\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t\tbranchRuleSchema {\n\t\t\t\t\t\tkey\n\t\t\t\t\t\tlabel\n\t\t\t\t\t\tdescription\n\t\t\t\t\t\tkind\n\t\t\t\t\t\trequired\n\t\t\t\t\t\texample\n\t\t\t\t\t}\n\t\t\t\t\tapprovalSettingsSchema {\n\t\t\t\t\t\tkey\n\t\t\t\t\t\tlabel\n\t\t\t\t\t\tdescription\n\t\t\t\t\t\tkind\n\t\t\t\t\t\trequired\n\t\t\t\t\t\texample\n\t\t\t\t\t\toptions {\n\t\t\t\t\t\t\tvalue\n\t\t\t\t\t\t\tlabel\n\t\t\t\t\t\t\tdescription\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t\tapprovalRuleSchema {\n\t\t\t\t\t\tkey\n\t\t\t\t\t\tlabel\n\t\t\t\t\t\tdescription\n\t\t\t\t\t\tkind\n\t\t\t\t\t\trequired\n\t\t\t\t\t\texample\n\t\t\t\t\t}\n\t\t\t\t\tassignment(course: $course, name: $name) {\n\t\t\t\t\t\tcourse\n\t\t\t\t\t\tname\n\t\t\t\t\t\textends\n\t\t\t\t\t\tabstract\n\t\t\t\t\t\town {\n\t\t\t\t\t\t\tkey\n\t\t\t\t\t\t\tvalue\n\t\t\t\t\t\t}\n\t\t\t\t\t\tresolved\n\t\t\t\t\t\tresolveError\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t"): (typeof documents)["\n\t\t\t\tquery AssignmentEditor($course: String!, $name: String!) {\n\t\t\t\t\tassignmentSchema {\n\t\t\t\t\t\tkey\n\t\t\t\t\t\tlabel\n\t\t\t\t\t\tdescription\n\t\t\t\t\t\tgroup\n\t\t\t\t\t\tkind\n\t\t\t\t\t\trequired\n\t\t\t\t\t\tdeprecated\n\t\t\t\t\t\texample\n\t\t\t\t\t\toptions {\n\t\t\t\t\t\t\tvalue\n\t\t\t\t\t\t\tlabel\n\t\t\t\t\t\t\tdescription\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t\tbranchRuleSchema {\n\t\t\t\t\t\tkey\n\t\t\t\t\t\tlabel\n\t\t\t\t\t\tdescription\n\t\t\t\t\t\tkind\n\t\t\t\t\t\trequired\n\t\t\t\t\t\texample\n\t\t\t\t\t}\n\t\t\t\t\tapprovalSettingsSchema {\n\t\t\t\t\t\tkey\n\t\t\t\t\t\tlabel\n\t\t\t\t\t\tdescription\n\t\t\t\t\t\tkind\n\t\t\t\t\t\trequired\n\t\t\t\t\t\texample\n\t\t\t\t\t\toptions {\n\t\t\t\t\t\t\tvalue\n\t\t\t\t\t\t\tlabel\n\t\t\t\t\t\t\tdescription\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t\tapprovalRuleSchema {\n\t\t\t\t\t\tkey\n\t\t\t\t\t\tlabel\n\t\t\t\t\t\tdescription\n\t\t\t\t\t\tkind\n\t\t\t\t\t\trequired\n\t\t\t\t\t\texample\n\t\t\t\t\t}\n\t\t\t\t\tassignment(course: $course, name: $name) {\n\t\t\t\t\t\tcourse\n\t\t\t\t\t\tname\n\t\t\t\t\t\textends\n\t\t\t\t\t\tabstract\n\t\t\t\t\t\town {\n\t\t\t\t\t\t\tkey\n\t\t\t\t\t\t\tvalue\n\t\t\t\t\t\t}\n\t\t\t\t\t\tresolved\n\t\t\t\t\t\tresolveError\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\t\t\tquery CourseYAML($name: String!) {\n\t\t\t\t\tcourseYAML(name: $name)\n\t\t\t\t}\n\t\t\t"): (typeof documents)["\n\t\t\t\tquery CourseYAML($name: String!) {\n\t\t\t\t\tcourseYAML(name: $name)\n\t\t\t\t}\n\t\t\t"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\t\t\tquery GitlabToken {\n\t\t\t\t\tgitlabToken {\n\t\t\t\t\t\tset\n\t\t\t\t\t\tupdatedAt\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t"): (typeof documents)["\n\t\t\t\tquery GitlabToken {\n\t\t\t\t\tgitlabToken {\n\t\t\t\t\t\tset\n\t\t\t\t\t\tupdatedAt\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;