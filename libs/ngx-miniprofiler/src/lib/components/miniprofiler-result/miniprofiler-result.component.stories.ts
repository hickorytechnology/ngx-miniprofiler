import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { RouterModule } from '@angular/router';
import { applicationConfig, Meta, StoryObj } from '@storybook/angular';
import { provideMiniProfilerConfig } from '../../providers';
import { MiniProfilerResultComponent } from './miniprofiler-result.component';

const meta: Meta = {
  title: 'MiniProfilerResultComponent',
  component: MiniProfilerResultComponent,
  decorators: [
    // Define application-wide providers with the applicationConfig decorator
    applicationConfig({
      providers: [
        importProvidersFrom(CommonModule, HttpClientModule, RouterModule),
        provideMiniProfilerConfig({
          api: 'https://localhost:5001/profiler',
          path: 'https://localhost:5001/profiler',
        }),
      ],
    }),
  ],
};

export default meta;

type Story = StoryObj<MiniProfilerResultComponent>;

export const Default: Story = {
  render: () => ({
    // Define application-wide providers directly in the render function
    applicationConfig: {
      providers: [importProvidersFrom(CommonModule)],
    },
  }),
};

export const Primary: Story = {
  args: {
    result: {
      Id: '1694e7cc-3432-4725-bbd9-d9c93cf99838',
      Name: 'BudgetCategoryGroups/FindAllForHousehold',
      Started: new Date('2023-06-12T03:34:32.4959372Z'),
      DurationMilliseconds: 3278.53,
      MachineName: '1023c6dfa8bd',
      Root: {
        Id: '8cf4e9d2-3a7f-4862-b5ee-7189b0daf179',
        Name: 'https://localhost:5001/api/budgetCategoryGroups/bf9e68ae-cee0-4cc7-9678-5c6bda37d258',
        DurationMilliseconds: 3278.52,
        StartMilliseconds: 0,
        Children: [
          {
            Id: '77434d8c-1ff0-430e-a124-c563c1c96273',
            Name: 'Action: MeMoney.WebUI.Controllers.Api.BudgetCategoryGroupsController.FindAllForHousehold',
            DurationMilliseconds: 3277.98,
            StartMilliseconds: 0.49,
            Children: [
              {
                Id: '9ea6833f-6f2d-47b2-ab4f-768bb1fb704d',
                Name: 'Resource Filter (Execing): SaveTempDataFilter',
                DurationMilliseconds: 0,
                StartMilliseconds: 0.53,
              },
              {
                Id: '0799e510-5b9f-47ee-a296-347b0aa9a585',
                Name: 'Action Filter (Execing): UnsupportedContentTypeFilter',
                DurationMilliseconds: 0,
                StartMilliseconds: 0.55,
              },
              {
                Id: 'a8c9bc01-9d3c-4cbc-972e-f0dfb838d3a0',
                Name: 'Controller Action: MeMoney.WebUI.Controllers.Api.BudgetCategoryGroupsController.FindAllForHousehold',
                DurationMilliseconds: 3130.13,
                StartMilliseconds: 0.56,
                CustomTimings: {
                  sql: [
                    {
                      Id: 'cc315349-c75e-428b-95f6-4fb1c2ecb062',
                      CommandString: 'Connection OpenAsync()',
                      ExecuteType: 'OpenAsync',
                      StackTraceSnippet:
                        'OpenAsync > Start > MoveNext > OpenInternalAsync > Start > MoveNext > ConnectionOpeningAsync > DispatchEventData > Write',
                      StartMilliseconds: 1.28,
                      DurationMilliseconds: 43.77,
                      Errored: false,
                    },
                    {
                      Id: 'a0b9eff6-5330-4a04-8bbb-8e29f08a2881',
                      CommandString:
                        'DECLARE @__userId_0 nvarchar = N\'d0c51ea1-4bdd-4db3-b840-114f2cb93d12\';\n\nSELECT a."Id", a."AccessFailedCount", a."ConcurrencyStamp", a."Email", a."EmailConfirmed", a."FirstName", a."LastName", a."LockoutEnabled", a."LockoutEnd", a."MeMoneyUserId", a."NormalizedEmail", a."NormalizedUserName", a."PasswordHash", a."PhoneNumber", a."PhoneNumberConfirmed", a."SecurityStamp", a."TwoFactorEnabled", a."UserName"\nFROM "AspNetUsers" AS a\nWHERE a."Id" = @__userId_0\nLIMIT 1;',
                      ExecuteType: 'ExecuteReader (Async)',
                      StackTraceSnippet:
                        'InitializeReaderAsync > Start > MoveNext > ExecuteReaderAsync > Start > MoveNext > CommandReaderExecutingAsync > DispatchEventData > Write',
                      StartMilliseconds: 45.17,
                      DurationMilliseconds: 44.6,
                      Errored: false,
                    },
                    {
                      Id: 'acd9d7f9-1110-4180-bbf0-e3ffb580b7ab',
                      CommandString: 'Connection CloseAsync()',
                      ExecuteType: 'CloseAsync',
                      StackTraceSnippet:
                        'DisposeAsync > DisposeAsync > Start > MoveNext > CloseAsync > Start > MoveNext > ConnectionClosingAsync > DispatchEventData > Write',
                      StartMilliseconds: 91.41,
                      DurationMilliseconds: 24.1,
                      Errored: false,
                    },
                    {
                      Id: '6fe8c423-e785-4672-8a26-bab0421c48e0',
                      CommandString: 'Connection OpenAsync()',
                      ExecuteType: 'OpenAsync',
                      StackTraceSnippet:
                        'OpenAsync > Start > MoveNext > OpenInternalAsync > Start > MoveNext > ConnectionOpeningAsync > DispatchEventData > Write',
                      StartMilliseconds: 180.18,
                      DurationMilliseconds: 25.24,
                      Errored: false,
                    },
                    {
                      Id: 'e0e139eb-3148-4cee-9207-e8dfab0732ac',
                      CommandString:
                        'DECLARE @__request_HouseholdId_0 nvarchar = N\'bf9e68ae-cee0-4cc7-9678-5c6bda37d258\';\n\nSELECT b."Id", t1."BudgetCategoryGroupId", t1."HouseholdId", t1."Id", t1."BudgetCategoryId", t1."Budgeted", t1."Id0", t1."Month", t1."Year", t1."Name", t1."Amount", t1."BankAccountName", t1."BudgetCategoryId0", t1."BudgetCategoryName", t1."CashFlow", t1."Date", t1."HouseholdMemberName", t1."Id1", t1."Memo", t1."PayeeId", t1."PayeeName", t1."Id00", t1."Id10", t1."Id2", t1."Id3", t1."Id4", b."HiddenFromBudget", b."Name"\nFROM budget_category_group AS b\nLEFT JOIN (\n    SELECT b0."BudgetCategoryGroupId", b0."HouseholdId", b0."Id", m."BudgetCategoryId", m."Budgeted", m."Id" AS "Id0", m."Month", m."Year", b0."Name", t0."Amount", t0."BankAccountName", t0."BudgetCategoryId" AS "BudgetCategoryId0", t0."BudgetCategoryName", t0."CashFlow", t0."Date", t0."HouseholdMemberName", t0."Id" AS "Id1", t0."Memo", t0."PayeeId", t0."PayeeName", t0."Id0" AS "Id00", t0."Id1" AS "Id10", t0."Id2", t0."Id3", t0."Id4"\n    FROM budget_category AS b0\n    LEFT JOIN monthly_budget AS m ON b0."Id" = m."BudgetCategoryId"\n    LEFT JOIN (\n        SELECT t."Amount", b1."Name" AS "BankAccountName", t."BudgetCategoryId", b2."Name" AS "BudgetCategoryName", t."CashFlow", t."Date", u."FirstName" AS "HouseholdMemberName", t."Id", t."Memo", t."PayeeId", p."Name" AS "PayeeName", b1."Id" AS "Id0", b2."Id" AS "Id1", h."Id" AS "Id2", u."Id" AS "Id3", p."Id" AS "Id4"\n        FROM transaction AS t\n        LEFT JOIN bank_account AS b1 ON t."BankAccountId" = b1."Id"\n        LEFT JOIN budget_category AS b2 ON t."BudgetCategoryId" = b2."Id"\n        LEFT JOIN household_member AS h ON t."HouseholdMemberId" = h."Id"\n        LEFT JOIN "user" AS u ON h."UserId" = u."Id"\n        LEFT JOIN payee AS p ON t."PayeeId" = p."Id"\n    ) AS t0 ON b0."Id" = t0."BudgetCategoryId"\n) AS t1 ON b."Id" = t1."BudgetCategoryGroupId"\nWHERE b."HouseholdId" = @__request_HouseholdId_0\nORDER BY b."Id", t1."Id", t1."Id0", t1."Id1", t1."Id00", t1."Id10", t1."Id2", t1."Id3";',
                      ExecuteType: 'ExecuteReader (Async)',
                      StackTraceSnippet:
                        'InitializeReaderAsync > Start > MoveNext > ExecuteReaderAsync > Start > MoveNext > CommandReaderExecutingAsync > DispatchEventData > Write',
                      StartMilliseconds: 208.92,
                      DurationMilliseconds: 309.89,
                      Errored: false,
                    },
                    {
                      Id: '05fda65e-1f6f-46ae-a79f-befaa6cc6240',
                      CommandString: 'Connection CloseAsync()',
                      ExecuteType: 'CloseAsync',
                      StackTraceSnippet:
                        'DisposeAsync > DisposeAsync > Start > MoveNext > CloseAsync > Start > MoveNext > ConnectionClosingAsync > DispatchEventData > Write',
                      StartMilliseconds: 3105.01,
                      DurationMilliseconds: 0.72,
                      Errored: false,
                    },
                    {
                      Id: '6feae3f8-9990-4b8a-8891-26fd381819ad',
                      CommandString: 'Connection OpenAsync()',
                      ExecuteType: 'OpenAsync',
                      StackTraceSnippet:
                        'OpenAsync > Start > MoveNext > OpenInternalAsync > Start > MoveNext > ConnectionOpeningAsync > DispatchEventData > Write',
                      StartMilliseconds: 3105.97,
                      DurationMilliseconds: 0.26,
                      Errored: false,
                    },
                    {
                      Id: '97c338ce-73c4-49de-956d-a06b47285d5d',
                      CommandString:
                        'DECLARE @__userId_0 nvarchar = N\'d0c51ea1-4bdd-4db3-b840-114f2cb93d12\';\n\nSELECT a."Id", a."AccessFailedCount", a."ConcurrencyStamp", a."Email", a."EmailConfirmed", a."FirstName", a."LastName", a."LockoutEnabled", a."LockoutEnd", a."MeMoneyUserId", a."NormalizedEmail", a."NormalizedUserName", a."PasswordHash", a."PhoneNumber", a."PhoneNumberConfirmed", a."SecurityStamp", a."TwoFactorEnabled", a."UserName"\nFROM "AspNetUsers" AS a\nWHERE a."Id" = @__userId_0\nLIMIT 1;',
                      ExecuteType: 'ExecuteReader (Async)',
                      StackTraceSnippet:
                        'InitializeReaderAsync > Start > MoveNext > ExecuteReaderAsync > Start > MoveNext > CommandReaderExecutingAsync > DispatchEventData > Write',
                      StartMilliseconds: 3106.32,
                      DurationMilliseconds: 3.2,
                      Errored: false,
                    },
                    {
                      Id: 'aaab6493-5b29-4769-8a0d-ac0ee04cdd89',
                      CommandString: 'Connection CloseAsync()',
                      ExecuteType: 'CloseAsync',
                      StackTraceSnippet:
                        'DisposeAsync > DisposeAsync > Start > MoveNext > CloseAsync > Start > MoveNext > ConnectionClosingAsync > DispatchEventData > Write',
                      StartMilliseconds: 3109.91,
                      DurationMilliseconds: 20.61,
                      Errored: false,
                    },
                  ],
                },
              },
              {
                Id: '6fd99650-b01c-44f3-9098-ec7b26ddc8d5',
                Name: 'Action Filter (Execed): UnsupportedContentTypeFilter',
                DurationMilliseconds: 0,
                StartMilliseconds: 3130.72,
              },
              {
                Id: '27a2d4fe-354c-4ec6-b197-8aa554d1ffd9',
                Name: 'Result Filter (Execing): SaveTempDataFilter',
                DurationMilliseconds: 0,
                StartMilliseconds: 3130.73,
              },
              {
                Id: '56c8b963-4903-4eda-8cc5-26523571196b',
                Name: 'Result Filter (Execing): ClientErrorResultFilter',
                DurationMilliseconds: 0,
                StartMilliseconds: 3130.73,
              },
              {
                Id: '956b7fc8-cb6c-436a-ba01-b67740171332',
                Name: 'Object: BudgetCategoryGroupsVm',
                DurationMilliseconds: 147.61,
                StartMilliseconds: 3130.74,
              },
              {
                Id: '90839ba5-82ba-42e2-b286-c4891684884c',
                Name: 'Result Filter (Execed): ClientErrorResultFilter',
                DurationMilliseconds: 0,
                StartMilliseconds: 3278.38,
              },
              {
                Id: 'c953fdab-80e3-4082-a4bb-eb66d88d9acb',
                Name: 'Result Filter (Execed): SaveTempDataFilter',
                DurationMilliseconds: 0,
                StartMilliseconds: 3278.39,
              },
              {
                Id: '8b439e9e-61b4-47a6-a8ee-9b7d58d988e5',
                Name: 'Resource Filter (Execed): SaveTempDataFilter',
                DurationMilliseconds: 0,
                StartMilliseconds: 3278.4,
              },
            ],
          },
        ],
      },
      User: '127.0.0.1',
      HasUserViewed: true,
    },
  },
};
