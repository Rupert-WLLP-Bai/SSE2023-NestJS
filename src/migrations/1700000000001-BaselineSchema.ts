import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class BaselineSchema1700000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tables: Table[] = [
      new Table({
        name: 'class',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'name', type: 'character varying' },
          { name: 'code', type: 'character varying', isNullable: true },
          { name: 'courseId', type: 'integer', isNullable: true },
          { name: 'teacherId', type: 'integer', isNullable: true },
          { name: 'teacherName', type: 'character varying', isNullable: true },
          { name: 'semester', type: 'character varying', isNullable: true },
          { name: 'year', type: 'integer', isNullable: true },
          { name: 'maxStudents', type: 'integer', isNullable: true },
          { name: 'currentStudents', type: 'integer', default: 0 },
          { name: 'description', type: 'character varying', isNullable: true },
          { name: 'createTime', type: 'timestamp without time zone' },
          { name: 'updateTime', type: 'timestamp without time zone' },
        ],
      }),
      new Table({
        name: 'course',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'name', type: 'character varying' },
          { name: 'code', type: 'character varying', isNullable: true },
          { name: 'description', type: 'character varying', isNullable: true },
          { name: 'teacherId', type: 'integer', isNullable: true },
          { name: 'teacherName', type: 'character varying', isNullable: true },
          { name: 'credit', type: 'integer', isNullable: true },
          { name: 'createTime', type: 'timestamp without time zone' },
          { name: 'updateTime', type: 'timestamp without time zone' },
        ],
      }),
      new Table({
        name: 'enrollment',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'studentId', type: 'integer' },
          { name: 'studentName', type: 'character varying', isNullable: true },
          { name: 'classId', type: 'integer' },
          { name: 'className', type: 'character varying', isNullable: true },
          { name: 'courseId', type: 'integer', isNullable: true },
          { name: 'courseName', type: 'character varying', isNullable: true },
          { name: 'status', type: 'character varying', isNullable: true },
          {
            name: 'enrollmentDate',
            type: 'timestamp without time zone',
            isNullable: true,
          },
          {
            name: 'dropDate',
            type: 'timestamp without time zone',
            isNullable: true,
          },
          { name: 'grade', type: 'integer', isNullable: true },
          { name: 'comment', type: 'character varying', isNullable: true },
          { name: 'createTime', type: 'timestamp without time zone' },
          { name: 'updateTime', type: 'timestamp without time zone' },
        ],
        indices: [
          new TableIndex({
            name: 'UQ_enrollment_student_course',
            columnNames: ['studentId', 'courseId'],
            isUnique: true,
          }),
        ],
      }),
      new Table({
        name: 'examination',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'title', type: 'character varying', isNullable: true },
          { name: 'description', type: 'character varying', isNullable: true },
          { name: 'courseId', type: 'integer', isNullable: true },
          { name: 'courseName', type: 'character varying', isNullable: true },
          { name: 'publisherId', type: 'integer', isNullable: true },
          {
            name: 'publisherName',
            type: 'character varying',
            isNullable: true,
          },
          {
            name: 'startTime',
            type: 'timestamp without time zone',
            isNullable: true,
          },
          {
            name: 'endTime',
            type: 'timestamp without time zone',
            isNullable: true,
          },
          { name: 'duration', type: 'integer', isNullable: true },
          { name: 'totalScore', type: 'integer', isNullable: true },
          { name: 'passingScore', type: 'integer', isNullable: true },
          { name: 'status', type: 'integer', isNullable: true, default: 0 },
          {
            name: 'type',
            type: 'character varying',
            isNullable: true,
            default: "'online'",
          },
          {
            name: 'createTime',
            type: 'timestamp without time zone',
            isNullable: true,
          },
          {
            name: 'updateTime',
            type: 'timestamp without time zone',
            isNullable: true,
          },
        ],
      }),
      new Table({
        name: 'examination_problem_list',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'examinationId', type: 'integer', isNullable: true },
          { name: 'problemId', type: 'integer', isNullable: true },
          { name: 'problemTitle', type: 'character varying', isNullable: true },
          { name: 'problemContent', type: 'text', isNullable: true },
          { name: 'problemScore', type: 'integer', isNullable: true },
          {
            name: 'problemType',
            type: 'character varying',
            isNullable: true,
            default: "'single_choice'",
          },
          { name: 'problemOrder', type: 'integer', isNullable: true },
          { name: 'answer', type: 'text', isNullable: true },
          {
            name: 'createTime',
            type: 'timestamp without time zone',
            isNullable: true,
          },
          {
            name: 'updateTime',
            type: 'timestamp without time zone',
            isNullable: true,
          },
        ],
      }),
      new Table({
        name: 'examination_score',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'courseId', type: 'integer' },
          { name: 'examinationId', type: 'integer' },
          { name: 'studentId', type: 'integer' },
          { name: 'problemId', type: 'integer' },
          { name: 'score', type: 'numeric', precision: 5, scale: 2 },
          {
            name: 'createTime',
            type: 'timestamp without time zone',
            default: 'now()',
          },
          {
            name: 'updateTime',
            type: 'timestamp without time zone',
            default: 'now()',
          },
        ],
        indices: [
          new TableIndex({
            name: 'UQ_examination_score_course_student_examination_problem',
            columnNames: [
              'courseId',
              'studentId',
              'examinationId',
              'problemId',
            ],
            isUnique: true,
          }),
        ],
      }),
      new Table({
        name: 'examination_student_list',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'examinationId', type: 'integer', isNullable: true },
          { name: 'studentId', type: 'integer', isNullable: true },
          { name: 'studentName', type: 'character varying', isNullable: true },
          {
            name: 'studentNumber',
            type: 'character varying',
            isNullable: true,
          },
          { name: 'status', type: 'integer', isNullable: true, default: 0 },
          { name: 'score', type: 'integer', isNullable: true },
          {
            name: 'startTime',
            type: 'timestamp without time zone',
            isNullable: true,
          },
          {
            name: 'endTime',
            type: 'timestamp without time zone',
            isNullable: true,
          },
          {
            name: 'createTime',
            type: 'timestamp without time zone',
            isNullable: true,
          },
          {
            name: 'updateTime',
            type: 'timestamp without time zone',
            isNullable: true,
          },
        ],
      }),
      new Table({
        name: 'examination_submit',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'examinationId', type: 'integer' },
          { name: 'studentId', type: 'integer' },
          { name: 'problemId', type: 'integer' },
          { name: 'answer', type: 'text', isNullable: true },
          {
            name: 'fileUrl',
            type: 'character varying',
            length: '500',
            isNullable: true,
          },
          { name: 'status', type: 'integer', isNullable: true, default: 0 },
          {
            name: 'score',
            type: 'numeric',
            precision: 5,
            scale: 2,
            isNullable: true,
          },
          { name: 'feedback', type: 'text', isNullable: true },
          {
            name: 'submitTime',
            type: 'timestamp without time zone',
            isNullable: true,
          },
          {
            name: 'createTime',
            type: 'timestamp without time zone',
            default: 'now()',
          },
          {
            name: 'updateTime',
            type: 'timestamp without time zone',
            default: 'now()',
          },
        ],
      }),
      new Table({
        name: 'examination_weight',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'courseId', type: 'integer' },
          { name: 'examinationId', type: 'integer' },
          { name: 'weight', type: 'numeric', precision: 5, scale: 2 },
          {
            name: 'createTime',
            type: 'timestamp without time zone',
            default: 'now()',
          },
          {
            name: 'updateTime',
            type: 'timestamp without time zone',
            default: 'now()',
          },
        ],
        indices: [
          new TableIndex({
            name: 'UQ_examination_weight_course_examination',
            columnNames: ['courseId', 'examinationId'],
            isUnique: true,
          }),
        ],
      }),
      new Table({
        name: 'experiment',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'title', type: 'character varying', isNullable: true },
          { name: 'publisherId', type: 'integer', isNullable: true },
          {
            name: 'publisherName',
            type: 'character varying',
            isNullable: true,
          },
          { name: 'description', type: 'character varying', isNullable: true },
          { name: 'courseId', type: 'integer', isNullable: true },
          { name: 'status', type: 'integer', isNullable: true },
          {
            name: 'startTime',
            type: 'timestamp without time zone',
            isNullable: true,
          },
          {
            name: 'endTime',
            type: 'timestamp without time zone',
            isNullable: true,
          },
          {
            name: 'createTime',
            type: 'timestamp without time zone',
            isNullable: true,
          },
          {
            name: 'updateTime',
            type: 'timestamp without time zone',
            isNullable: true,
          },
        ],
      }),
      new Table({
        name: 'experiment_score',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'courseId', type: 'integer' },
          { name: 'experimentId', type: 'integer' },
          { name: 'studentId', type: 'integer' },
          { name: 'score', type: 'numeric', precision: 5, scale: 2 },
          {
            name: 'createTime',
            type: 'timestamp without time zone',
            default: 'now()',
          },
          {
            name: 'updateTime',
            type: 'timestamp without time zone',
            default: 'now()',
          },
        ],
        indices: [
          new TableIndex({
            name: 'UQ_experiment_score_course_student_experiment',
            columnNames: ['courseId', 'studentId', 'experimentId'],
            isUnique: true,
          }),
        ],
      }),
      new Table({
        name: 'experiment_submit',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'experimentId', type: 'integer' },
          { name: 'studentId', type: 'integer' },
          { name: 'timeStamp', type: 'bigint' },
          { name: 'file', type: 'bytea', isNullable: true },
          { name: 'fileName', type: 'character varying', isNullable: true },
          { name: 'fileSize', type: 'integer', isNullable: true },
          { name: 'mineType', type: 'character varying', isNullable: true },
          { name: 'fieldname', type: 'character varying', isNullable: true },
          { name: 'encoding', type: 'character varying', isNullable: true },
          { name: 'fileUrl', type: 'character varying', isNullable: true },
        ],
      }),
      new Table({
        name: 'experiment_weight',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'courseId', type: 'integer' },
          { name: 'experimentId', type: 'integer' },
          { name: 'weight', type: 'numeric', precision: 5, scale: 2 },
          {
            name: 'createTime',
            type: 'timestamp without time zone',
            default: 'now()',
          },
          {
            name: 'updateTime',
            type: 'timestamp without time zone',
            default: 'now()',
          },
        ],
        indices: [
          new TableIndex({
            name: 'UQ_experiment_weight_course_experiment',
            columnNames: ['courseId', 'experimentId'],
            isUnique: true,
          }),
        ],
      }),
      new Table({
        name: 'notice',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'title', type: 'character varying', isNullable: true },
          { name: 'content', type: 'character varying', isNullable: true },
          {
            name: 'publishDate',
            type: 'timestamp without time zone',
            isNullable: true,
          },
          { name: 'publisherId', type: 'integer', isNullable: true },
          { name: 'publisher', type: 'character varying', isNullable: true },
        ],
      }),
      new Table({
        name: 'total_score',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'courseId', type: 'integer' },
          { name: 'studentId', type: 'integer' },
          { name: 'totalScore', type: 'numeric', precision: 5, scale: 2 },
          {
            name: 'experimentScore',
            type: 'numeric',
            precision: 5,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'examinationScore',
            type: 'numeric',
            precision: 5,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'createTime',
            type: 'timestamp without time zone',
            default: 'now()',
          },
          {
            name: 'updateTime',
            type: 'timestamp without time zone',
            default: 'now()',
          },
        ],
        indices: [
          new TableIndex({
            name: 'UQ_total_score_course_student',
            columnNames: ['courseId', 'studentId'],
            isUnique: true,
          }),
        ],
      }),
      new Table({
        name: 'total_weight',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'courseId', type: 'integer' },
          { name: 'experimentWeight', type: 'numeric', precision: 5, scale: 2 },
          {
            name: 'examinationWeight',
            type: 'numeric',
            precision: 5,
            scale: 2,
          },
          {
            name: 'createTime',
            type: 'timestamp without time zone',
            default: 'now()',
          },
          {
            name: 'updateTime',
            type: 'timestamp without time zone',
            default: 'now()',
          },
        ],
        indices: [
          new TableIndex({
            name: 'UQ_total_weight_courseId',
            columnNames: ['courseId'],
            isUnique: true,
          }),
        ],
      }),
      new Table({
        name: 'user',
        columns: [
          { name: 'id', type: 'integer', isPrimary: true },
          { name: 'name', type: 'character varying', isNullable: true },
          { name: 'password', type: 'character varying', isNullable: true },
          { name: 'email', type: 'character varying', isNullable: true },
          { name: 'phone', type: 'character varying', isNullable: true },
          { name: 'status', type: 'integer', isNullable: true },
          { name: 'role', type: 'integer', isNullable: true },
          {
            name: 'create_time',
            type: 'timestamp without time zone',
            isNullable: true,
          },
          {
            name: 'update_time',
            type: 'timestamp without time zone',
            isNullable: true,
          },
          {
            name: 'last_login_time',
            type: 'timestamp without time zone',
            isNullable: true,
          },
          { name: 'ip', type: 'character varying', isNullable: true },
        ],
      }),
    ];

    for (const table of tables) {
      if (!(await queryRunner.hasTable(table.name))) {
        await queryRunner.createTable(table);
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const name of [
      'user',
      'total_weight',
      'total_score',
      'notice',
      'experiment_weight',
      'experiment_submit',
      'experiment_score',
      'experiment',
      'examination_weight',
      'examination_submit',
      'examination_student_list',
      'examination_score',
      'examination_problem_list',
      'examination',
      'enrollment',
      'course',
      'class',
    ]) {
      await queryRunner.dropTable(name);
    }
  }
}
