import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs';
import { Workflow, WorkflowListQuery, WorkflowStatus } from '../../../../core/models/workflow.models';
import { AuthFacade } from '../../../auth/auth.facade';
import { WorkflowsFacade } from '../../workflows.facade';
import {
  WorkflowEditorDialogComponent,
  WorkflowEditorDialogData
} from '../../components/workflow-editor-dialog/workflow-editor-dialog.component';

@Component({
  selector: 'app-workflow-list-page',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    NgIf,
    NgFor,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule
  ],
  templateUrl: './workflow-list-page.component.html',
  styleUrls: ['./workflow-list-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkflowListPageComponent {
  private readonly workflows = inject(WorkflowsFacade);
  private readonly auth = inject(AuthFacade);
  private readonly dialog = inject(MatDialog);

  readonly columns = ['name', 'status', 'priority', 'dueDate', 'actions'] as const;

  readonly workflows$ = this.workflows.workflows$;
  readonly total$ = this.workflows.total$;
  readonly query$ = this.workflows.query$;

  readonly canCreate$ = this.auth.role$.pipe(map((r) => r === 'admin' || r === 'user'));
  readonly canEdit$ = this.canCreate$;
  readonly canDelete$ = this.auth.role$.pipe(map((r) => r === 'admin'));
  readonly canApprove$ = this.auth.role$.pipe(map((r) => r === 'admin' || r === 'manager'));

  readonly filters = new FormGroup({
    search: new FormControl<string>('', { nonNullable: true }),
    status: new FormControl<WorkflowStatus | null>(null)
  });

  constructor() {
    this.workflows.load({ page: 1, pageSize: 10 });
    this.filters.valueChanges
      .pipe(
        debounceTime(250),
        map((v) => ({
          search: (v.search ?? '').trim(),
          status: v.status || undefined
        }))
      )
      .subscribe((v) => {
        this.workflows.load({
          page: 1,
          pageSize: 10,
          ...v
        });
      });

  }

  trackById(_: number, w: Workflow): string {
    return w.id;
  }

  pageChanged(e: PageEvent): void {
    const current = this.filters.getRawValue();
    this.workflows.load({
      page: e.pageIndex + 1,
      pageSize: e.pageSize,
      search: current.search?.trim() || undefined,
      status: current.status ?? undefined
    });
  }

  openCreate(): void {
    const ref = this.dialog.open<WorkflowEditorDialogComponent, WorkflowEditorDialogData, any>(
      WorkflowEditorDialogComponent,
      { data: { mode: 'create' } }
    );
    ref.afterClosed().subscribe((value) => {
      if (!value) return;
      this.workflows.create(value);
    });
  }

  openEdit(w: Workflow): void {
    const ref = this.dialog.open<WorkflowEditorDialogComponent, WorkflowEditorDialogData, any>(
      WorkflowEditorDialogComponent,
      { data: { mode: 'edit', workflow: w } }
    );
    ref.afterClosed().subscribe((value) => {
      if (!value) return;
      this.workflows.updateOptimistic(w.id, value, w);
    });
  }

  delete(w: Workflow): void {
    this.workflows.deleteOptimistic(w.id, w);
  }

  approve(w: Workflow): void {
    this.workflows.updateOptimistic(
      w.id,
      { status: 'Approved' },
      w
    );
  }
}

