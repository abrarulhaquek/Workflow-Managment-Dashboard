import { AsyncPipe, DecimalPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { BaseChartDirective } from 'ng2-charts';

import { map, shareReplay } from 'rxjs';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [AsyncPipe, DecimalPipe, NgIf, NgFor, MatCardModule, BaseChartDirective],
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPageComponent {
  private readonly dashboard = inject(DashboardService);

  readonly stats$ = this.dashboard.getStats().pipe(shareReplay(1));

  readonly byStatusList$ = this.stats$.pipe(
    map((s) => [
      { label: 'Draft', value: s.byStatus.Draft },
      { label: 'In Review', value: s.byStatus['In Review'] },
      { label: 'Approved', value: s.byStatus.Approved },
      { label: 'Rejected', value: s.byStatus.Rejected }
    ])
  );

  readonly overdue$ = this.stats$.pipe(map((s) => s.overdue));
  readonly avgDays$ = this.stats$.pipe(map((s) => s.averageCompletionDays));

  readonly chartData$ = this.stats$.pipe(
    map((s) => ({
      labels: ['Draft', 'In Review', 'Approved', 'Rejected'],
      datasets: [
        {
          data: [s.byStatus.Draft, s.byStatus['In Review'], s.byStatus.Approved, s.byStatus.Rejected]
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

