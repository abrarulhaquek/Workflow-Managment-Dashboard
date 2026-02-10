import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { debounceTime, first, map, switchMap } from 'rxjs';
import { WorkflowsApi } from '../../services/workflows.api';
import {
  Workflow,
  WorkflowPriority,
  WorkflowStatus,
} from '../../../../core/models/workflow.models';

export interface WorkflowEditorDialogData {
  mode: 'create' | 'edit';
  workflow?: Workflow;
}
function dateFormatValidator(control: AbstractControl) {
  const value = control.value as string | null;
  if (!value) return null;

  // DD-MM-YYYY format (no alphabets)
  const dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;

  return dateRegex.test(value) ? null : { invalidDateFormat: true };
}

function dueDateNotPast(control: AbstractControl) {
  const v = control.value as string | null;
  if (!v) return null;

  // v is DD-MM-YYYY
  const parts = v.split('-');
  if (parts.length !== 3) return null;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // 0-indexed
  const year = parseInt(parts[2], 10);

  const inputDate = new Date(year, month, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return inputDate < today ? { dueDatePast: true } : null;
}

function workflowNameUniqueValidator(
  api: WorkflowsApi,
  excludeId?: string,
): AsyncValidatorFn {
  return (control) => {
    const name = (control.value as string | null) ?? '';
    if (!name.trim()) return Promise.resolve(null);

    return control.valueChanges.pipe(
      debounceTime(250),
      switchMap(() => api.validateName(name, excludeId)),
      map((r) => (r.isUnique ? null : { nameNotUnique: true })),
      first(),
    );
  };
}

@Component({
  selector: 'app-workflow-editor-dialog',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './workflow-editor-dialog.component.html',
  styleUrls: ['./workflow-editor-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkflowEditorDialogComponent {
  readonly form: FormGroup<{
    name: FormControl<string>;
    priority: FormControl<WorkflowPriority>;
    status: FormControl<WorkflowStatus>;
    assignedUserIds: FormControl<string>;
    dueDate: FormControl<string>;
  }>;

  constructor(
    private readonly api: WorkflowsApi,
    private readonly ref: MatDialogRef<WorkflowEditorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) readonly data: WorkflowEditorDialogData,
  ) {
    this.form = new FormGroup({
      name: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3)],
        asyncValidators: [
          workflowNameUniqueValidator(this.api, this.data.workflow?.id),
        ],
        updateOn: 'blur',
      }),
      priority: new FormControl<WorkflowPriority>('Medium', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      status: new FormControl<WorkflowStatus>('Draft', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      assignedUserIds: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      dueDate: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, dateFormatValidator, dueDateNotPast],
      }),
    });

    if (data.workflow) {
      this.form.patchValue({
        name: data.workflow.name,
        priority: data.workflow.priority,
        status: data.workflow.status,
        assignedUserIds: data.workflow.assignedUserIds.join(','),
        dueDate: data.workflow.dueDate,
      });
    }
  }

  save(): void {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    this.ref.close({
      name: v.name,
      priority: v.priority,
      status: v.status,
      assignedUserIds: v.assignedUserIds
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      dueDate: v.dueDate,
      createdAt: this.data.workflow?.createdAt ?? new Date().toISOString(),
    } satisfies Omit<Workflow, 'id'>);
  }

  close(): void {
    this.ref.close();
  }
}
