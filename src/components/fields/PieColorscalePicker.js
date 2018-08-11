import ColorscalePicker from '../widgets/ColorscalePicker';
import Field from './Field';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {connectToContainer, adjustColorscale} from 'lib';

class UnconnectedPieColorscalePicker extends Component {
  constructor(props) {
    super(props);
    this.onUpdate = this.onUpdate.bind(this);
  }

  onUpdate(colorscale, colorscaleType) {
    if (Array.isArray(colorscale)) {
      const numPieSlices = this.context.graphDiv.calcdata[0].length + 1;
      const adjustedColorscale = adjustColorscale(
        colorscale,
        numPieSlices,
        colorscaleType,
        {repeat: true}
      );
      this.props.updatePlot(adjustedColorscale);
    }
  }

  render() {
    const {fullValue} = this.props;
    const colorscale = Array.isArray(fullValue)
      ? fullValue.map(v => v[1])
      : null;

    return (
      <Field {...this.props}>
        <ColorscalePicker
          selected={colorscale}
          onColorscaleChange={this.onUpdate}
          initialCategory="categorical"
        />
      </Field>
    );
  }
}

UnconnectedPieColorscalePicker.propTypes = {
  fullValue: PropTypes.any,
  updatePlot: PropTypes.func,
  ...Field.propTypes,
};

UnconnectedPieColorscalePicker.contextTypes = {
  container: PropTypes.object,
  graphDiv: PropTypes.object,
};

export default connectToContainer(UnconnectedPieColorscalePicker, {
  modifyPlotProps: (props, context, plotProps) => {
    if (
      context &&
      context.container &&
      context.graphDiv &&
      (!plotProps.fullValue ||
        (Array.isArray(plotProps.fullValue) && !plotProps.fullValue.length)) &&
      context.graphDiv.calcdata
    ) {
      plotProps.fullValue = context.graphDiv.calcdata[0].map(d => [0, d.color]);
    }

    if (
      plotProps.fullValue &&
      Array.isArray(plotProps.fullValue) &&
      !plotProps.fullValue.every(el => Array.isArray(el))
    ) {
      plotProps.fullValue = plotProps.fullValue.map(c => [0, c]);
    }

    if (context.traceIndexes.length > 1) {
      plotProps.isVisible = false;
    }
  },
});
