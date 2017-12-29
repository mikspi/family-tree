import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import s from './styles.css';

const d3 = require('d3');

class D3Tree extends React.Component {

  componentDidMount() {
    // Render the tree usng d3 after first component mount
    this.renderTree(this.props.treeData);
  }

  shouldComponentUpdate() {
    // Delegate rendering the tree to a d3 function on prop change
    this.renderTree(this.props.treeData);

    // Do not allow react to render the component on prop change
    return false;
  }

  renderTree(treeData) {
    const svgDomNode = this.svg;
    const margin = {
      top: 90,
      right: 0,
      bottom: 60,
      left: 0,
    };
    const width = window.innerWidth;
    const height = 1500;
    let i = 0;
    const duration = 750;
    const tree = d3.layout.tree()
      .size([width, height]);
    const diagonal = d3.svg.diagonal()
      .projection(d => [d.x, d.y]);
    const svg = d3.select(svgDomNode)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    const rootNode = treeData[0];
    rootNode.x0 = width/2;
    rootNode.y0 = 0;

    function update(source) {
      // Compute the new tree layout.
      const nodes = tree.nodes(rootNode).reverse();
      const links = tree.links(nodes);

      // Normalize for fixed-depth.
      nodes.forEach(d => (d.y = d.depth * 150));
      //nodes.forEach(d => (d.x = d.x * 1));

      // Update the nodes…
      const node = svg.selectAll('g.node')
        .data(nodes, d => d.id || (d.id = ++i));

      // Enter any new nodes at the parent's previous position.
      const nodeEnter = node.enter().append('g')
        .attr('class', cx('node', s.node))
        .attr('transform', () => ('translate(' + source.x0 + ',' + source.y0 + ')'))
        .on('click', click);

      nodeEnter.append('circle')
        //.attr('r', 2e-6)
        .style('fill', d => (d._children ? 'lightsteelblue' : '#fff'));

      nodeEnter.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '-1.2em')
        .text(d => d.textA)
        .style('fill-opacity', 1)
        .style('font-size', '8px');
      nodeEnter.append('text')
        .attr('dy', '0')
        .attr('text-anchor', 'middle')
        .text(d => d.textB)
        .style('fill-opacity', 1)
        .style('font-size', '8px');
      nodeEnter.append('text')
        .attr('dy', '1.2em')
        .attr('text-anchor', 'middle')
        .text(d => d.textC)
        .style('fill-opacity', 1)
        .style('font-size', '8px');
      nodeEnter.append('text')
        .attr('dy', '2.4em')
        .attr('text-anchor', 'middle')
        .text(d => d.textD)
        .style('fill-opacity', 1)
        .style('font-size', '8px');

      // Transition nodes to their new position.
      const nodeUpdate = node.transition()
        .duration(duration)
        .attr('transform', d => 'translate(' + d.x + ',' + d.y + ')');

      nodeUpdate.select('circle')
        .attr('r', 55)
        .style('fill', d => (d._children ? 'lightsteelblue' : '#fff'));

      nodeUpdate.select('text')
        .style('fill-opacity', 1);

      // Transition exiting nodes to the parent's new position.
      const nodeExit = node.exit().transition()
        .duration(duration)
        .attr('transform', () => 'translate(' + source.x + ',' + source.y + ')')
        .remove();

      nodeExit.select('circle')
        .attr('r', 1e-6);

      nodeExit.select('text')
        .style('fill-opacity', 1e-6);

      // Update the links…
      const link = svg.selectAll('path.link')
        .data(links, d => d.target.id);

      // Enter any new links at the parent's previous position.
      link.enter().insert('path', 'g')
        .attr('class', cx('link', s.link))
        .attr('d', d => {
          const o = {
            x: source.x0,
            y: source.y0,
          };
          return diagonal({
            source: o,
            target: o,
          });
        });

      // Transition links to their new position.
      link.transition()
        .duration(duration)
        .attr('d', diagonal);

      // Transition exiting nodes to the parent's new position.
      link.exit().transition()
        .duration(duration)
        .attr('d', () => {
          const o = {
            x: source.x,
            y: source.y,
          };
          return diagonal({
            source: o,
            target: o,
          });
        })
        .remove();

      // Stash the old positions for transition.
      nodes.forEach((d) => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    const click = (d) => {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      update(d);
    };

    update(rootNode);
    //d3.select(self.frameElement).style('height', '900px');
  }

  render() {
    // Render a blank svg node
    return (
      <svg ref={(svg) => { this.svg = svg; }} />
    );
  }

}

D3Tree.propTypes = {
  treeData: PropTypes.array,
};

export default D3Tree;
