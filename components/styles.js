import {StyleSheet} from 'react-native';

const rules = {
  fspace: {
    justifyContent: 'space-between',
  },
  frow: {
    flexDirection: 'row',
  },
  fcenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fright: {
    justifyContent: 'flex-end',
  },
  fVertCenter: {
    alignItems: 'center',
  },
  fleft: {
    justifyContent: 'flex-start',
  },
  p1: {
    padding: 10,
  },
  p2: {
    padding: 16,
  },
  pl1: {
    paddingLeft: 10,
  },
  pl2: {
    paddingLeft: 16,
  },
  pr1: {
    paddingRight: 10,
  },
  pr2: {
    paddingRight: 16,
  },
  py1: {
    paddingVertical: 10,
  },
  py2: {
    paddingVertical: 16,
  },
  px1: {
    paddingHorizontal: 10,
  },
  px2: {
    paddingHorizontal: 16,
  },
  m1: {
    margin: 10,
  },
  m2: {
    margin: 16,
  },
  ml1: {
    marginLeft: 10,
  },
  ml2: {
    marginLeft: 16,
  },
  mr1: {
    marginRight: 10,
  },
  mr2: {
    marginRight: 16,
  },
  my1: {
    marginVertical: 10,
  },
  my2: {
    marginVertical: 16,
  },
  mx1: {
    marginHorizontal: 10,
  },
  mx2: {
    marginHorizontal: 16,
  },
  button: {
    width: 50,
    borderRadius: 20,
  },
  br1: {
    borderRadius: 5,
  },
  br2: {
    borderRadius: 10,
  },
  bround: {
    borderBottomStartRadius: 100,
    borderBottomEndRadius: 100,
    borderTopStartRadius: 100,
    borderTopEndRadius: 100,
  },
  btops: {
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
  },
  bbottoms: {
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
  },
  btops1: {
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
  },
  bbottoms1: {
    borderBottomStartRadius: 20,
    borderBottomEndRadius: 20,
  },
  posRel: {
    position: 'relative',
  },
  posAbs: {
    position: 'absolute',
  },
};

export default StyleSheet.create(rules);
