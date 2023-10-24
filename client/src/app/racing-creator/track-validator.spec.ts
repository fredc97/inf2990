import { TrackValidator } from "./track-validator";
import { Point } from "./point";
// tslint:disable:no-magic-numbers
describe("TrackValidator", () => {
  const point: Point = new Point();
  const point2: Point = new Point();
  const point3: Point = new Point();
  const point4: Point = new Point();
  const point5: Point = new Point();
  const point6: Point = new Point();
  it("should be created", () => {
    const service: TrackValidator = new TrackValidator([]);
    expect(service).toBeTruthy();
  });

  describe("lengthValidate with modifie point = last added point", () => {
    it("should get true (there is only one point)", () => {
      point.setPoint(1, 0, 0);
      const points: Point[] = [point];
      const service: TrackValidator = new TrackValidator(points);
      expect(service.validateLength(point, 50)).toEqual(true);
    });
    it("should get true (length >= width * 2)", () => {
      point.setPoint(-1, 0, 0);
      point2.setPoint(1, 0, 0);
      const points: Point[] = [point2, point];
      const service: TrackValidator = new TrackValidator(points);
      expect(service.validateLength(point, 1)).toEqual(true);
    });
    it("should get false (length < width * 2)", () => {
      point.setPoint(0, 1, 0);
      point.setPoint(1, 0, 0);
      const points: Point[] = [point2, point];
      const service: TrackValidator = new TrackValidator(points);
      expect(service.validateLength(point, 4)).toEqual(false);
    });
  });

  describe("lengthValidate with modifie point = last point", () => {
    it("should get true (length >= width * 2)", () => {
      point.setPoint(1, 0, 0);
      point2.setPoint(-1, 0, 0);
      const points: Point[] = [point, point2];
      const service: TrackValidator = new TrackValidator(points);
      expect(service.validateLength(point, 1)).toEqual(true);
    });
    it("should get false (length < width * 2)", () => {
      point.setPoint(1, 0, 0);
      point2.setPoint(0, 1, 0);
      const points: Point[] = [point, point2];
      const service: TrackValidator = new TrackValidator(points);
      expect(service.validateLength(point, 4)).toEqual(false);
    });
  });

  describe("lengthValidate with modifie point = middle point", () => {
    it("should get true (length >= width * 2 from two sides)", () => {
      point.setPoint(0, 2, 0);
      point2.setPoint(-1, 0, 0);
      point3.setPoint(1, 0, 0);
      const points: Point[] = [point3, point, point2];
      const service: TrackValidator = new TrackValidator(points);
      expect(service.validateLength(point, 1)).toEqual(true);
    });
    it("should get false (length < width * 2 from right side)", () => {
      point.setPoint(0, 0, 0);
      point2.setPoint(-2, 0, 0);
      point3.setPoint(1, 0, 0);
      const points: Point[] = [point2, point, point3];
      const service: TrackValidator = new TrackValidator(points);
      expect(service.validateLength(point, 1)).toEqual(false);
    });
    it("should get false (length < width * 2 from left side)", () => {
      point.setPoint(0, 0, 0);
      point2.setPoint(-1, 0, 0);
      point3.setPoint(2, 0, 0);
      const points: Point[] = [point2, point, point3];
      const service: TrackValidator = new TrackValidator(points);
      expect(service.validateLength(point, 1)).toEqual(false);
    });
  });

  describe("validateAngle with modified point = last added point", () => {
    it("should get true (There is less than 3 points = no angle)", () => {
      point.setPoint(0, 0, 0);
      point2.setPoint(1, 0, 0);
      const points: Point[] = [point2, point];
      const service: TrackValidator = new TrackValidator(points);
      expect(service.validateAngle(point)).toEqual(true);
    });
    it("should get true (angle of middle point>=45)", () => {
      point.setPoint(1, 1, 0);
      point2.setPoint(0, 0, 0);
      point3.setPoint(1, 0, 0);
      const points: Point[] = [point3, point2, point];

      const service: TrackValidator = new TrackValidator(points);
      expect(service.validateAngle(point)).toEqual(true);
    });
    it("should get false (angle of middle point<45)", () => {
      point.setPoint(0, 1, 0);
      point2.setPoint(0, 0, 0);
      point3.setPoint(0, 2, 0);
      const points: Point[] = [point3, point2, point];
      const service: TrackValidator = new TrackValidator(points);
      expect(service.validateAngle(point)).toEqual(false);
    });
  });

  describe("validateAngle with modified point = first point", () => {
    it("should get true (angle of middle point>=45)", () => {
      point.setPoint(0, 0, 0);
      point2.setPoint(1, 0, 0);
      point3.setPoint(1, 1, 0);
      const points: Point[] = [point, point2, point3];
      const service: TrackValidator = new TrackValidator(points);
      expect(service.validateAngle(point)).toEqual(true);
    });
    it("should get false (angle of middle point<45)", () => {
      point.setPoint(0, 2, 0);
      point2.setPoint(1, 0, 0);
      point3.setPoint(1, 1, 0);
      const points: Point[] = [point, point2, point3];
      const service: TrackValidator = new TrackValidator(points);
      expect(service.validateAngle(point)).toEqual(false);
    });
  });

  describe("validateAngle with modified point = middle point", () => {
    it("should get true (angle of middle point>=45)", () => {
      point.setPoint(1, 0, 0);
      point2.setPoint(0, 0, 0);
      point3.setPoint(1, 1, 0);
      const points: Point[] = [point2, point, point3];
      const service: TrackValidator = new TrackValidator(points);
      expect(service.validateAngle(point)).toEqual(true);
    });
    it("should get false (angle of middle point<45)", () => {
      point.setPoint(1, 0, 0);
      point2.setPoint(0, 2, 0);
      point3.setPoint(1, 1, 0);
      const points: Point[] = [point2, point, point3];
      const service: TrackValidator = new TrackValidator(points);
      expect(service.validateAngle(point)).toEqual(false);
    });
  });

  describe("validateSegment with modified point = last point", () => {
    it("should get true (there are less than 4 points)", () => {
        point.setPoint(0, 0, 1);
        point2.setPoint(0, 0, 0);
        const points: Point[] = [point2, point];
        const service: TrackValidator = new TrackValidator(points);
        expect(service.validateSegment(point)).toEqual(true);
      });
    it("should get true (the segment composed of the two last points does not intersect with others)", () => {
        point.setPoint(1, 0, 1);
        point2.setPoint(0, 0, 0);
        point3.setPoint(0, 0, 1);
        point.setPoint(1, 0, 0);
        const points: Point[] = [point2, point3, point4, point];
        const service: TrackValidator = new TrackValidator(points);
        expect(service.validateSegment(point)).toEqual(true);
      });
    it("should get false (the segment composed of the two last points intersect with others)", () => {
        point.setPoint(-1, 0, 1);
        point2.setPoint(0, 0, 0);
        point3.setPoint(0, 0, 2);
        point4.setPoint(1, 0, 1);
        const points: Point[] = [point2, point3, point4, point];
        const service: TrackValidator = new TrackValidator(points);
        expect(service.validateSegment(point)).toEqual(false);
      });
  });

  describe("validateSegment with modified point = first point", () => {
    it("should get true (the segment composed of the two first points does not intersect with others)", () => {
        point.setPoint(0, 0, 0);
        point2.setPoint(0, 0, 1);
        point3.setPoint(1, 0, 0);
        point4.setPoint(1, 0, 1);
        const points: Point[] = [point, point2, point3, point4];
        const service: TrackValidator = new TrackValidator(points);
        expect(service.validateSegment(point)).toEqual(true);
      });
    it("should get false (the segment composed of the two first points intersect with others)", () => {
        point.setPoint(0, 0, 0);
        point2.setPoint(0, 0, 2);
        point3.setPoint(1, 0, 1);
        point4.setPoint(-1, 0, 1);
        const points: Point[] = [point, point2, point3, point4];
        const service: TrackValidator = new TrackValidator(points);
        expect(service.validateSegment(point)).toEqual(false);
      });
  });

  describe("validateSegment with modified point = middle point", () => {
    it("should get true (the segment composed of the two middle points does not intersect with others)", () => {
        point.setPoint(1, 0, 1);
        point2.setPoint(0, 0, 0);
        point3.setPoint(0, 0, 1);
        point4.setPoint(1, 0, 0);
        point5.setPoint(1, 0, 2);
        point6.setPoint(2, 0, 2);
        const points: Point[] = [point2, point3, point4, point, point5, point6];
        const service: TrackValidator = new TrackValidator(points);
        expect(service.validateSegment(point)).toEqual(true);
      });
    it("should get false (the segment composed of the two middle points intersect with others)", () => {
        point.setPoint(-1, 0, 1);
        point2.setPoint(0, 0, 0);
        point3.setPoint(0, 0, 1);
        point4.setPoint(1, 0, 0);
        point5.setPoint(1, 0, 2);
        point6.setPoint(2, 0, 2);
        const points: Point[] = [point2, point3, point4, point, point5, point6];
        const service: TrackValidator = new TrackValidator(points);
        expect(service.validateSegment(point)).toEqual(false);
      });
  });
});
