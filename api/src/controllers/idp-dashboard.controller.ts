import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository, Where} from '@loopback/repository';
import {get, HttpErrors, param, response} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {PermissionKeys} from '../authorization/permission-keys';
import {ProcessInstances, Processes} from '../models';
import {
  ProcessInstancesRepository,
  ProcessesRepository,
} from '../repositories';

interface DateRange {
  startDate?: Date;
  endDate?: Date;
}

interface IdpDashboardCounts {
  totalProcesses: number;
  currentRunningProcesses: number;
  totalProcessInstances: number;
  failedProcessInstances: number;
  filters: {
    startDate?: string;
    endDate?: string;
    hours?: number;
  };
}

export class IdpDashboardController {
  constructor(
    @repository(ProcessesRepository)
    public processesRepository: ProcessesRepository,
    @repository(ProcessInstancesRepository)
    public processInstancesRepository: ProcessInstancesRepository,
  ) {}

  private readonly failedStages = [
    'failed',
    'Failed',
    'FAILED',
    'failure',
    'Failure',
    'FAILURE',
    'error',
    'Error',
    'ERROR',
  ];

  private parseDate(value: string, fieldName: string): Date {
    const parsedDate = new Date(value);

    if (Number.isNaN(parsedDate.getTime())) {
      throw new HttpErrors.BadRequest(`${fieldName} must be a valid date`);
    }

    return parsedDate;
  }

  private getDateRange(
    startDate?: string,
    endDate?: string,
    hours?: number,
  ): DateRange {
    let resolvedStartDate: Date | undefined;
    let resolvedEndDate: Date | undefined;

    if (hours !== undefined) {
      if (hours <= 0) {
        throw new HttpErrors.BadRequest('hours must be greater than 0');
      }

      resolvedEndDate = new Date();
      resolvedStartDate = new Date(
        resolvedEndDate.getTime() - hours * 60 * 60 * 1000,
      );
    }

    if (startDate) {
      resolvedStartDate = this.parseDate(startDate, 'startDate');
    }

    if (endDate) {
      resolvedEndDate = this.parseDate(endDate, 'endDate');
    }

    if (
      resolvedStartDate &&
      resolvedEndDate &&
      resolvedStartDate > resolvedEndDate
    ) {
      throw new HttpErrors.BadRequest('startDate must be before endDate');
    }

    return {
      startDate: resolvedStartDate,
      endDate: resolvedEndDate,
    };
  }

  private dateWhere<T extends {createdAt?: Date}>(range: DateRange): Where<T>[] {
    const where: Where<T>[] = [];

    if (range.startDate) {
      where.push({createdAt: {gte: range.startDate}} as Where<T>);
    }

    if (range.endDate) {
      where.push({createdAt: {lte: range.endDate}} as Where<T>);
    }

    return where;
  }

  private isSuperAdmin(currentUser: UserProfile): boolean {
    return Boolean(currentUser.permissions?.includes(PermissionKeys.SUPER_ADMIN));
  }

  private buildProcessesWhere(
    currentUser: UserProfile,
    range: DateRange,
    extraWhere?: Where<Processes>,
  ): Where<Processes> {
    const and: Where<Processes>[] = [
      {isDeleted: false},
      ...this.dateWhere<Processes>(range),
    ];

    if (!this.isSuperAdmin(currentUser)) {
      and.push({userId: currentUser.id} as Where<Processes>);
    }

    if (extraWhere) {
      and.push(extraWhere);
    }

    return {and};
  }

  private buildProcessInstancesWhere(
    currentUser: UserProfile,
    range: DateRange,
    extraWhere?: Where<ProcessInstances>,
  ): Where<ProcessInstances> {
    const and: Where<ProcessInstances>[] = [
      {isDeleted: false},
      ...this.dateWhere<ProcessInstances>(range),
    ];

    if (!this.isSuperAdmin(currentUser)) {
      and.push({userId: currentUser.id} as Where<ProcessInstances>);
    }

    if (extraWhere) {
      and.push(extraWhere);
    }

    return {and};
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [
        PermissionKeys.SUPER_ADMIN,
        PermissionKeys.ADMIN,
        PermissionKeys.COMPANY,
      ],
    },
  })
  @get('/dashboard/idp-counts')
  @response(200, {
    description: 'IDP dashboard counts',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            totalProcesses: {type: 'number'},
            currentRunningProcesses: {type: 'number'},
            totalProcessInstances: {type: 'number'},
            failedProcessInstances: {type: 'number'},
            filters: {
              type: 'object',
              properties: {
                startDate: {type: 'string'},
                endDate: {type: 'string'},
                hours: {type: 'number'},
              },
            },
          },
        },
      },
    },
  })
  async getCounts(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
    @param.query.string('startDate') startDate?: string,
    @param.query.string('endDate') endDate?: string,
    @param.query.number('hours') hours?: number,
  ): Promise<IdpDashboardCounts> {
    const range = this.getDateRange(startDate, endDate, hours);

    const [
      totalProcesses,
      currentRunningProcesses,
      totalProcessInstances,
      failedProcessInstances,
    ] = await Promise.all([
      this.processesRepository.count(
        this.buildProcessesWhere(currentUser, range),
      ),
      this.processInstancesRepository.count(
        this.buildProcessInstancesWhere(currentUser, range, {
          isInstanceRunning: true,
        }),
      ),
      this.processInstancesRepository.count(
        this.buildProcessInstancesWhere(currentUser, range),
      ),
      this.processInstancesRepository.count(
        this.buildProcessInstancesWhere(currentUser, range, {
          currentStage: {inq: this.failedStages},
        } as Where<ProcessInstances>),
      ),
    ]);

    return {
      totalProcesses: totalProcesses.count,
      currentRunningProcesses: currentRunningProcesses.count,
      totalProcessInstances: totalProcessInstances.count,
      failedProcessInstances: failedProcessInstances.count,
      filters: {
        startDate: range.startDate?.toISOString(),
        endDate: range.endDate?.toISOString(),
        hours,
      },
    };
  }
}
