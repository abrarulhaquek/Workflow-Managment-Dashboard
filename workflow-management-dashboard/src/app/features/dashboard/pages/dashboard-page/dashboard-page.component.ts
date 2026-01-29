import { AsyncPipe, DecimalPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { Store } from '@ngrx/store';
import { BaseChartDirective } from 'ng2-charts';

import { map } from 'rxjs';

import {
  selectAverageCompletionDays,
  selectOverdueCount,
  selectWorkflowsByStatus
} from '../../dashboard.selectors';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [AsyncPipe, DecimalPipe, NgIf, NgFor, MatCardModule, BaseChartDirective],
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPageComponent {
  private readonly store = inject(Store);

  readonly byStatus$ = this.store.select(selectWorkflowsByStatus);
  readonly byStatusList$ = this.byStatus$.pipe(
    map((m) => [
      { label: 'Draft', value: m.Draft },
      { label: 'In Review', value: m['In Review'] },
      { label: 'Approved', value: m.Approved },
      { label: 'Rejected', value: m.Rejected }
    ])
  );

  readonly overdue$ = this.store.select(selectOverdueCount);
  readonly avgDays$ = this.store.select(selectAverageCompletionDays);

  readonly chartData$ = this.byStatus$.pipe(
    map((m) => ({
      labels: ['Draft', 'In Review', 'Approved', 'Rejected'],
      datasets: [
        {
          data: [m.Draft, m['In Review'], m.Approved, m.Rejected]
        }
      ]
    }))
  );

  readonly emptyChartData = {
    labels: ['Draft', 'In Review', 'Approved', 'Rejected'],
    datasets: [{ data: [0, 0, 0, 0] }]
  };

  readonly chartOptions = {
    responsive: true,
    maintainAspectRatio: false
  } as const;
}

