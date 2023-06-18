import { Meta } from '@storybook/angular';
import { MiniProfilerComponent } from './miniprofiler.component';

export default {
  title: 'MiniProfilerComponent',
  component: MiniProfilerComponent,
} as Meta<MiniProfilerComponent>;

export const Primary = {
  render: (args: MiniProfilerComponent) => ({
    props: args,
  }),
  args: {},
};
